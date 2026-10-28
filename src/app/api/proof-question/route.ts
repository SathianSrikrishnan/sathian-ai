import { POST as receiveNote } from '@/app/api/agent/message/route'
import { proofQuestionsReady } from '@/lib/proof-question'
export const runtime='nodejs'
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}})
const allowed=new Set(['question','replyEmail','sourcePage','consent','company'])
export async function POST(request:Request) {
 if (!proofQuestionsReady()) return reply({error:'Please email your question using the contact link.'},503)
 if (request.headers.get('origin')!==new URL(request.url).origin) return reply({error:'Invalid origin.'},403)
 if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply({error:'A JSON request is required.'},415)
 const text=await request.text();if(Buffer.byteLength(text,'utf8')>8192)return reply({error:'Please keep your question under 2,000 characters.'},413)
 let body:Record<string,unknown>
 try {body=JSON.parse(text);if(!body||typeof body!=='object'||Array.isArray(body))throw new Error()}catch{return reply({error:'Please check your question.'},400)}
 if(Object.keys(body).some(key=>!allowed.has(key))||body.company!==''||body.consent!==true)return reply({error:'Please check your question and permission to send it.'},400)
 const question=typeof body.question==='string'?body.question.trim():''
 const email=typeof body.replyEmail==='string'?body.replyEmail.trim():''
 if(!question||question.length>2000||email.length>320||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||!['/proof','/learn'].includes(String(body.sourcePage)))return reply({error:'Please check your question and optional email.'},400)
 const headers=new Headers(request.headers);headers.delete('content-length')
 const forwarded=new Request(request.url,{method:'POST',headers,body:JSON.stringify({intent:'note',message:question,replyEmail:email||undefined,page:body.sourcePage,consent:true})})
 try {
  const response=await receiveNote(forwarded);const result=await response.json()
  if(!response.ok)return reply({error:response.status===429?'Please wait before trying again, or email us.':'Your question was not saved. Please email us.'},response.status)
  if(result.capabilities?.intakeStored!==true||!/^SA-[A-Z0-9]{10}$/.test(result.receipt?.code||'')||!['queued','delivered','failed'].includes(result.receipt?.deliveryStatus))return reply({error:'Your question was not confirmed saved. Please email us.'},502)
  return reply({ok:true,receipt:{code:result.receipt.code,deliveryStatus:result.receipt.deliveryStatus}},response.status)
 } catch {return reply({error:'Your question was not confirmed saved. Please email us.'},503)}
}
