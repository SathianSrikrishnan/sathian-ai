import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const results = []
for (const route of ['index', 'village']) {
  const html = fs.readFileSync(path.join(root, '.next/server/app', `${route}.html`), 'utf8')
  const styles = [...html.matchAll(/<link\b[^>]*>/g)].map(match => match[0]).filter(tag => /rel="stylesheet"/.test(tag)).map(tag => /href="([^"]+)"/.exec(tag)?.[1]).filter(Boolean)
  if (!styles.length) throw new Error(`${route}: expected real stylesheets, not unstyled or altered benchmark markup`)
  const files = [...new Set(styles.map(url => path.join(root, '.next', url.split('?')[0].replace(/^\/_next\//, ''))))]
  const gzipBytes = files.reduce((sum, file) => sum + gzipSync(fs.readFileSync(file)).length, 0)
  if (gzipBytes > 25000) throw new Error(`${route}: blocking CSS exceeds 25KB gzip budget (${gzipBytes}). Inspect the route imports.`)
  results.push({ route, blockingStylesheets: files.length, gzipBytes })
}
console.log(JSON.stringify({ compiledMarketingStyles: 'passed', results }))
