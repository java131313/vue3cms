/*
** Client-side auth state + actions. The user is loaded once by
** plugins/auth.ts and kept in a shared useState; mutations below keep it
** in sync.
*/
export interface AuthUser {
  id: string
  email: string
  name: string
}

export function useAuth () {
  const user = useState<AuthUser | null>('auth:user', () => null)

  async function fetchUser () {
    try {
      const res = await $fetch<{ user: AuthUser | null }>('/api/auth/me')
      user.value = res.user
    } catch {
      user.value = null
    }
    return user.value
  }

  async function register (input: { email: string, password: string, name?: string }) {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: input
    })
    await fetchUser()
  }

  async function login (input: { email: string, password: string }) {
    await $fetch('/api/auth/login', { method: 'POST', body: input })
    await fetchUser()
  }

  async function logout () {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  return { user, fetchUser, register, login, logout }
}
