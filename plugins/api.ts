export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
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

      console.log(error)
    },
    async onResponseError({ response }) {
      const token = useCookie('token')
      if (response.status === 401) {
        token.value = null
        await nuxtApp.runWithContext(() => navigateTo('/auth'))
      }

      console.log(response)
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})
