import { useRequestURL } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const url = useRequestURL()
  const ip = url.host
  let baseURL = ''
  switch (ip) {
    case '127.0.0.1':
    case '127.0.0.1:3000':
      baseURL = 'http://127.0.0.1:8000/'
      break
    case '10.32.0.204':
    case '10.32.0.204:31':
      baseURL = 'http://10.32.0.204:82/'
      break
    case '46.16.9.130':
    case '46.16.9.130:49021':
      baseURL = 'http://10.32.0.204:82/'
      break
  }
  const api = $fetch.create({
    baseURL,
    onRequest({ request, options, error }) {
      console.log(ip)
      console.log(request)
      const token = useCookie('token')
      const accessToken = token.value
      console.log(accessToken)
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
