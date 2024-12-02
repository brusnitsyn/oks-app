import { useRequestURL } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    onRequest({ request, options, error }) {
      const url = useRequestURL()
      const ip = url.host
      switch (ip) {
        case '127.0.0.1:3000':
          options.baseURL = 'http://127.0.0.1:8000/'
          break
        case '10.32.0.204:31':
          options.baseURL = 'http://10.32.0.204:82/'
          break
        case '46.16.9.130:49021':
          options.baseURL = 'http://46.16.9.130:49022/'
          break
      }
      console.log(ip)
      const token = useCookie('token')
      const accessToken = token.value
      if (accessToken) {
        options.mode = options.mode ?? 'cors'
        const headers = options.headers ||= {}
        if (Array.isArray(headers)) {
          headers.push(['Authorization', `Bearer ${token.value}`])
          headers.push(['Accept', `application/json`])
        }
        else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${token.value}`)
          headers.set('Accept', `application/json`)
        }
        else {
          headers.Authorization = `Bearer ${token.value}`
          headers.Accept = `application/json`
        }
      }
    },
    async onResponseError({ response }) {
      const token = useCookie('token')
      if (response.status === 401) {
        token.value = null
        await nuxtApp.runWithContext(() => navigateTo('/auth'))
      }
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})
