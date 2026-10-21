/*
** Register a new account. The account is activated immediately and the user
** is logged in straight away (session cookie is set).
*/
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const { email, password, name } = await readBody(event) || {}
  const cleanEmail = String(email || '').trim().toLowerCase()
  const displayName = String(name || '').trim().slice(0, 50)
  const cleanPassword = String(password || '')

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid email address is required' })
  }
  if (cleanPassword.length < 8 || cleanPassword.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be 8-128 characters' })
  }

  const db = getDb(event)
  const existing = await db.prepare('SELECT status FROM users WHERE email = ?').bind(cleanEmail).first()
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists' })
  }

  const { salt, hash } = await hashPassword(cleanPassword)
  const id = crypto.randomUUID()
  const created = now()

  await db.prepare(
    `INSERT INTO users (id, email, name, password_hash, salt, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`
  ).bind(id, cleanEmail, displayName, hash, salt, created, created).run()

  await createSession(event, id)
  return { ok: true, user: { id, email: cleanEmail, name: displayName } }
})
