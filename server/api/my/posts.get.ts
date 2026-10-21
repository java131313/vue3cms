/** Posts authored by the logged-in user, newest first. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const { results } = await getDb(event).prepare(
    `SELECT p.*, u.name AS author_name FROM user_posts p
     JOIN users u ON u.id = p.author_id
     WHERE p.author_id = ? ORDER BY p.created_at DESC`
  ).bind(user.id).all()
  return { posts: (results || []).map(serializePost) }
})
