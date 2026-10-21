/*
** Log in with email + password. Only activated accounts can log in.
*/
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const { email, password } = await readBody(event) || {}
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanPassword = String(password || '')

  const genericError = createError({ statusCode: 401, statusMessage: 'Invalid email or password' })

  const user = await getDb(event).prepare('SELECT * FROM users WHERE email = ?').bind(cleanEmail).first()
  if (!user) { throw genericError }

  const valid = await verifyPassword(cleanPassword, user.salt, user.password_hash)
  if (!valid) { throw genericError }

  if (user.status !== 'active') {
    throw createError({ statusCode: 403, statusMessage: 'Account is not activated yet — check your inbox for the activation link' })
  }

  await createSession(event, user.id)
  return { ok: true, user: { id: user.id, email: user.email, name: user.name } }
})
