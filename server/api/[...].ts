import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const hostname = getRequestURL(event).hostname
  let proxyUrl = ''
  switch (hostname) {
    case 'localhost':
    case '127.0.0.1':
      proxyUrl = 'http://46.16.9.130:49022/api'
      break
    case '10.32.0.204':
      proxyUrl = 'http://10.32.0.204:82/api'
      break
    case '46.16.9.130':
      proxyUrl = 'http://46.16.9.130:49022/api'
      break
  }

  // check the path
  const path = event.path.replace(/^\/api\//, '') // /api/users -> users
  const target = joinURL(proxyUrl, path)

  // proxy it!
  return proxyRequest(event, target)
})
