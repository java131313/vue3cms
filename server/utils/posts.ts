/*
** User-authored posts (stored in D1 at runtime, next to the build-time
** markdown collection served by @nuxt/content).
*/
export function serializePost (row: any) {
  const date = new Date(row.created_at).toISOString()
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    body: row.body,
    date,
    updatedAt: new Date(row.updated_at).toISOString(),
    author: row.author_name || ''
  }
}

/** "Hello World!" → "hello-world"; falls back to a random suffix slug. */
export function slugify (title: string) {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
  return base || `post-${randomToken(4)}`
}

/** Ensures the slug is unique across user posts. */
export async function uniqueSlug (db: any, title: string, excludeId?: string) {
  const base = slugify(title)
  let candidate = base
  for (let i = 2; ; i++) {
    const row = await db.prepare('SELECT id FROM user_posts WHERE slug = ?').bind(candidate).first()
    if (!row || row.id === excludeId) { return candidate }
    candidate = `${base}-${i}`
  }
}

export function validatePostInput (body: any) {
  const title = String(body?.title || '').trim()
  const content = String(body?.body || '').trim()
  const description = String(body?.description || '').trim().slice(0, 300)

  if (!title || title.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required (max 200 characters)' })
  }
  if (!content || content.length > 100_000) {
    throw createError({ statusCode: 400, statusMessage: 'Post body is required (max 100k characters)' })
  }
  return { title, body: content, description }
}
