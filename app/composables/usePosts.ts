/*
** Data access for blog posts, replaces the old Vuex store.
** Page layouts and pages share the same useAsyncData keys so the
** payload is fetched once and reused across layout + page.
*/
export function usePostsList () {
  return useAsyncData('posts', () =>
    queryCollection('posts').order('date', 'DESC').all()
  )
}

export function usePost (slug: string) {
  return useAsyncData(`post-${slug}`, () =>
    queryCollection('posts').path(`/posts/${slug}`).first()
  )
}
