import { useRequestURL } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const url = useRequestURL()

  const ip = url.hostname
  let baseURL = 'http://46.16.9.130:49022/'
  switch (ip) {
    case '127.0.0.1':
      baseURL = 'http://127.0.0.1:8001/'
      break
    case '10.32.0.204':
      baseURL = 'http://10.32.0.204:82/'
      break
    case '46.16.9.130':
      baseURL = 'http://46.16.9.130:49022/'
      break
  }
  const api = $fetch.create({
    baseURL,
    onRequest({ request, options, error }) {
      // console.log(options.baseURL)
      const token = useCookie('token')
      const accessToken = token.value
      // console.log(accessToken)
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
