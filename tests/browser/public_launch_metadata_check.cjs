const assert = require('node:assert/strict')
const http = require('node:http')

const port = Number(process.env.PORT || 3120)

function request(path, host) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: '127.0.0.1', port, path, headers: { Host: host } },
      (response) => {
        const chunks = []
        response.on('data', (chunk) => chunks.push(chunk))
        response.on('end', () => {
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        })
      },
    )
    req.on('error', reject)
    req.end()
  })
}

;(async () => {
  const home = await request('/', 'sathian.ai')
  assert.equal(home.status, 200)
  assert.equal(home.headers['x-content-type-options'], 'nosniff')
  assert.equal(home.headers['x-frame-options'], 'DENY')
  assert.equal(home.headers['referrer-policy'], 'strict-origin-when-cross-origin')
  assert.match(home.headers['permissions-policy'], /camera=\(self\)/)
  assert.match(home.headers['permissions-policy'], /microphone=\(self\)/)
  assert.match(home.headers['permissions-policy'], /geolocation=\(\)/)

  const sathianRobots = await request('/robots.txt', 'sathian.ai')
  assert.equal(sathianRobots.status, 200)
  assert.match(sathianRobots.body, /Sitemap: https:\/\/sathian\.ai\/sitemap\.xml/)
  assert.doesNotMatch(sathianRobots.body, /toothfairy\.network/)

  const sathianSitemap = await request('/sitemap.xml', 'sathian.ai')
  assert.equal(sathianSitemap.status, 200)
  assert.match(sathianSitemap.body, /https:\/\/sathian\.ai\/about/)
  assert.match(sathianSitemap.body, /https:\/\/sathian\.ai\/writings\/the-gap-between-weeks/)
  assert.doesNotMatch(sathianSitemap.body, /toothfairy\.network/)

  const toothFairyRobots = await request('/robots.txt', 'toothfairy.network')
  assert.equal(toothFairyRobots.status, 200)
  assert.match(toothFairyRobots.body, /Sitemap: https:\/\/toothfairy\.network\/sitemap\.xml/)

  console.log('public launch metadata verification passed: headers, sathian.ai SEO, Tooth Fairy SEO')
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
