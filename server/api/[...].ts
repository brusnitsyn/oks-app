import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const proxyUrl = 'http://localhost:82/api'

  // check the path
  const path = event.path.replace(/^\/api\//, '') // /api/users -> users
  const target = joinURL(proxyUrl, path)

  // proxy it!
  return proxyRequest(event, target)
})
