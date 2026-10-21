/*
** Password hashing (PBKDF2-SHA256 via WebCrypto — runs on Cloudflare Workers
** and in Node) and cookie-based sessions stored in D1.
*/
const PBKDF2_ITERATIONS = 100_000
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
export const SESSION_COOKIE = 'vcm_session'

const textEncoder = new TextEncoder()

async function deriveKey (password: string, saltHex: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const saltBytes = hexToBytes(saltHex)
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: PBKDF2_ITERATIONS },
    key,
    256
  )
  return bytesToHex(new Uint8Array(bits))
}

export async function hashPassword (password: string) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16))
  const salt = bytesToHex(saltBytes)
  const hash = await deriveKey(password, salt)
  return { salt, hash }
}

export async function verifyPassword (password: string, salt: string, expectedHash: string) {
  const actual = await deriveKey(password, salt)
  // constant-time comparison
  const a = textEncoder.encode(actual)
  const b = textEncoder.encode(expectedHash)
  if (a.length !== b.length) { return false }
  let diff = 0
  for (let i = 0; i < a.length; i++) { diff |= a[i]! ^ b[i]! }
  return diff === 0
}

export function randomToken (bytes = 32) {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(bytes)))
}

export async function createSession (event: any, userId: string) {
  const db = getDb(event)
  const token = randomToken()
  const created = now()
  await db.prepare(
    'INSERT INTO user_sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).bind(token, userId, created + SESSION_TTL_MS, created).run()
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000
  })
  return token
}

export async function destroySession (event: any) {
  const token = getCookie(event, SESSION_COOKIE)
  if (token) {
    await getDb(event).prepare('DELETE FROM user_sessions WHERE token = ?').bind(token).run()
  }
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export async function getSessionUser (event: any) {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) { return null }
  const row = await getDb(event).prepare(
    `SELECT u.id, u.email, u.name, u.status, s.expires_at
     FROM user_sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = ?`
  ).bind(token).first()
  if (!row) { return null }
  if (row.expires_at < now() || row.status !== 'active') {
    await getDb(event).prepare('DELETE FROM user_sessions WHERE token = ?').bind(token).run()
    return null
  }
  return { id: row.id, email: row.email, name: row.name }
}

/** Throws a 401 error when the request is not from a logged-in, activated user. */
export async function requireUser (event: any) {
  const user = await getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }
  return user
}

/**
 * Light CSRF protection for cookie-authenticated mutations: when the browser
 * sends an Origin/Referer header it must match the request host. (Cross-site
 * form posts cannot set `Content-Type: application/json`, and cross-site
 * fetch gets a CORS preflight failure.)
 */
export function assertSameOrigin (event: any) {
  const origin = getRequestHeader(event, 'origin') || getRequestHeader(event, 'referer')
  if (!origin) { return }
  const host = getRequestHost(event, { xForwardedHost: true })
  if (new URL(origin).host !== host) {
    throw createError({ statusCode: 403, statusMessage: 'Cross-origin request rejected' })
  }
}

function bytesToHex (bytes: Uint8Array) {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

function hexToBytes (hex: string) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
