/*
** Guard for authenticated pages (applied via definePageMeta in the my/ area).
** The auth plugin has already populated the user state before middleware runs.
*/
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  if (!user.value) {
    return navigateTo({ path: '/login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : {} })
  }
})
