/** Update a post (author only). */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  assertSameOrigin(event)

  const id = String(getRouterParam(event, 'id') || '')
  const db = getDb(event)
  const existing = await db.prepare('SELECT * FROM user_posts WHERE id = ?').bind(id).first()
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  if (existing.author_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'You can only edit your own posts' })
  }

  const input = validatePostInput(await readBody(event))
  const slug = await uniqueSlug(db, input.title, id)

  await db.prepare(
    'UPDATE user_posts SET title = ?, body = ?, description = ?, slug = ?, updated_at = ? WHERE id = ?'
  ).bind(input.title, input.body, input.description, slug, now(), id).run()

  return { post: serializePost({ ...existing, ...input, slug, updated_at: now(), author_name: user.name }) }
})
