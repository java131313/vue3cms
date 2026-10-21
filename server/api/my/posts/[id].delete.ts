/** Delete a post (author only). */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  assertSameOrigin(event)

  const id = String(getRouterParam(event, 'id') || '')
  const db = getDb(event)
  const existing = await db.prepare('SELECT author_id FROM user_posts WHERE id = ?').bind(id).first()
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  if (existing.author_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'You can only delete your own posts' })
  }

  await db.prepare('DELETE FROM user_posts WHERE id = ?').bind(id).run()
  return { ok: true }
})
