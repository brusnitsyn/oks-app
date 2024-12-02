export default defineNuxtPlugin(async (nitroApp) => {
  const auth = useSanctumAuth()
  const cookieToken = useCookie('token')
  if (cookieToken.value) { await auth.refreshUser() }
})
