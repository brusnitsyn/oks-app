import { useSanctumConfig } from './useSanctumConfig'

export function useSanctumAuth() {
  const user = useState('user', () => null)
  const cookieToken = useCookie('token')
  const isAuthenticated = computed(() => cookieToken.value)
  const isAdmin = user.value?.data?.role === 'administrator'
  const isOperator = user.value?.data?.role === 'operator'
  const isDoctor = user.value?.data?.role === 'doctor'
  const config = useSanctumConfig()
  // const { client } = useSanctumFetch()

  async function refreshUser() {
    const { data } = await useAPI(config.endpoints.user)
    user.value = data.value
  }

  async function login(credentials: Record<string, any>) {
    const { data } = await useAPI(config.endpoints.login, {
      method: 'POST',
      body: credentials
    })

    if (data.value.token) {
      cookieToken.value = data.value.token
      // eslint-disable-next-line style/max-statements-per-line
      if (cookieToken.value) { await refreshUser() }
      return true
    }

    return false
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isOperator,
    isDoctor,
    cookieToken,
    refreshUser,
    login
  }
}
