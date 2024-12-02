import { useRequestURL } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const cookieToken = useCookie('token')
  const url = useRequestURL().host
  let baseURL = 'http://127.0.0.1:8000/api'
  console.log(url)
  switch (url) {
    case '127.0.0.1:3000':
      baseURL = 'http://127.0.0.1:8000/'
      break
    case '10.32.0.204:31':
      baseURL = 'http://10.32.0.204:82/'
      break
    case '46.16.9.130:49021':
      baseURL = 'http://46.16.9.130:49022/'
      break
  }
  const api = $fetch.create({
    baseURL,
    onRequest({ request, options, error }) {
      if (cookieToken.value) {
        options.mode = options.mode ?? 'cors'
        const headers = options.headers ||= {}
        if (Array.isArray(headers)) {
          headers.push(['Authorization', `Bearer ${cookieToken.value}`])
          headers.push(['Accept', `application/json`])
        }
        else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${cookieToken.value}`)
          headers.set('Accept', `application/json`)
        }
        else {
          headers.Authorization = `Bearer ${cookieToken.value}`
          headers.Accept = `application/json`
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        cookieToken.value = null
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
