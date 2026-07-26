import { createServer } from 'node:http'

const user = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'operator@example.com',
  email_confirmed_at: '2026-07-14T12:00:00.000Z',
  phone: '',
  confirmed_at: '2026-07-14T12:00:00.000Z',
  last_sign_in_at: '2026-07-14T12:00:00.000Z',
  app_metadata: { provider: 'email', providers: ['email'], role: 'studio_admin' },
  user_metadata: {},
  identities: [],
  factors: [
    {
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      factor_type: 'totp',
      status: 'verified',
      friendly_name: 'Studio test authenticator',
      created_at: '2026-07-14T12:00:00.000Z',
      updated_at: '2026-07-14T12:00:00.000Z',
    },
  ],
  created_at: '2026-07-14T12:00:00.000Z',
  updated_at: '2026-07-14T12:00:00.000Z',
  is_anonymous: false,
}

const server = createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', 'authorization, apikey, content-type, x-client-info')

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }
  if (request.url === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ ok: true }))
    return
  }
  if (request.method === 'GET' && request.url === '/auth/v1/user') {
    const authorization = request.headers.authorization ?? ''
    if (!authorization.startsWith('Bearer ')) {
      response.writeHead(401, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: 'missing token' }))
      return
    }
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(user))
    return
  }

  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'not found' }))
})

server.listen(54321, '127.0.0.1')

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
