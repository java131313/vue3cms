/** Create a new post (authenticated, activated users only). */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  assertSameOrigin(event)

  const input = validatePostInput(await readBody(event))
  const db = getDb(event)
  const id = crypto.randomUUID()
  const slug = await uniqueSlug(db, input.title)
  const created = now()

  await db.prepare(
    `INSERT INTO user_posts (id, slug, title, body, description, author_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, slug, input.title, input.body, input.description, user.id, created, created).run()

  return { post: serializePost({ id, slug, ...input, created_at: created, updated_at: created, author_name: user.name }) }
})
