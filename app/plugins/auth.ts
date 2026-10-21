/*
** Loads the current user before anything renders so server-side rendering,
** route middleware and the nav bar all see the same auth state.
** useRequestFetch() invokes /api/auth/me in-process during SSR.
*/
export default defineNuxtPlugin(async () => {
  const user = useState('auth:user', () => null)
  const $api = useRequestFetch()
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  try {
    const res = await $api<{ user: any }>('/api/auth/me', { headers })
    user.value = res.user
  } catch {
    user.value = null
  }
})
