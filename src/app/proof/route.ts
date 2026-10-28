import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { proofQuestionsReady, proofQuestionMarkup } from '@/lib/proof-question'
export const runtime = 'nodejs'
export async function GET() {
 let html = await readFile(path.join(process.cwd(), 'public/proof/index.html'), 'utf8')
 if (process.env.CENTRAL_SIGNUP_REVIEW === 'true') html = html.replace('content="index,follow"', 'content="noindex,nofollow"')
 html = html.replace('<!--PROOF_QUESTION-->', proofQuestionsReady() ? proofQuestionMarkup : '')
 const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
 const analytics = /^G-[A-Z0-9]+$/.test(id) ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});</script>` : ''
 html = html.replace('<!--PROOF_ANALYTICS-->', analytics)
 return new Response(html, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}})
}
