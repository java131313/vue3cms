/*
** Data access for blog posts, replaces the old Vuex store.
** Two sources are merged into one stream:
**   - markdown files at build time, via @nuxt/content (queryCollection)
**   - user-authored posts at runtime, via /api/* (D1)
** Server-side API calls go through useRequestFetch(), which invokes the
** Nitro handlers in-process (a Worker cannot loopback-fetch its own
** *.workers.dev URL — Cloudflare rejects it with "error code: 1042").
** Page layouts and pages share the same useAsyncData keys so the
** payload is fetched once and reused across layout + page.
*/
export function usePostsList () {
  return useAsyncData('posts', async () => {
    const $api = useRequestFetch()
    const [contentPosts, userPosts] = await Promise.all([
      queryCollection('posts').order('date', 'DESC').all(),
      $api<{ posts: any[] }>('/api/posts').then(r => r.posts).catch(() => [])
    ])

    const items = [
      ...contentPosts.map((post: any) => ({
        slug: post.path.replace(/^\/posts\//, ''),
        title: post.title,
        date: post.date,
        source: 'content' as const
      })),
      ...userPosts.map((post: any) => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        source: 'user' as const
      }))
    ]

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return items
  })
}

export function usePost (slug: string) {
  return useAsyncData(`post-${slug}`, async () => {
    const $api = useRequestFetch()
    const [userPost, contentPost] = await Promise.all([
      $api<{ post: any }>(`/api/posts/${encodeURIComponent(slug)}`).then(r => r.post).catch(() => null),
      queryCollection('posts').path(`/posts/${slug}`).first()
    ])

    if (userPost) { return { post: userPost, source: 'user' as const } }
    if (contentPost) { return { post: contentPost, source: 'content' as const } }
    return { post: null, source: null }
  })
}
