/** Public single user post, looked up by slug. */
export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, 'slug') || '')
  const row = await getDb(event).prepare(
    `SELECT p.*, u.name AS author_name FROM user_posts p
     JOIN users u ON u.id = p.author_id
     WHERE p.slug = ?`
  ).bind(slug).first()

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  return { post: serializePost(row) }
})
