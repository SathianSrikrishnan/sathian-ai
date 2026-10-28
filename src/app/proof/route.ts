import { readFile } from 'node:fs/promises'
import path from 'node:path'
export const runtime = 'nodejs'
export async function GET() {
 let html = await readFile(path.join(process.cwd(), 'public/proof/index.html'), 'utf8')
 const signupEnabled = process.env.CENTRAL_SIGNUP_ENABLED === 'true' && process.env.CENTRAL_SIGNUP_REVIEW !== 'true'
 if (signupEnabled) html = html.replaceAll(' disabled data-central-disabled', '').replace(/<p id="signup-preview"[^>]*>[\s\S]*?<\/p>/, '')
 if (process.env.CENTRAL_SIGNUP_REVIEW === 'true') html = html.replace('content="index,follow"', 'content="noindex,nofollow"').replace('<main>', '<main><p id="proof-review-banner" role="note">Protected design review · signup inactive.</p>')
 const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
 const analytics = /^G-[A-Z0-9]+$/.test(id) ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});</script>` : ''
 html = html.replace('<!--PROOF_ANALYTICS-->', analytics)
 return new Response(html, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}})
}
