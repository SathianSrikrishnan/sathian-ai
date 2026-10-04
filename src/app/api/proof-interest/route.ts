import { createHash } from 'node:crypto'
import { notifyProofInterest } from '@/lib/proof-notification'
export const runtime = 'nodejs'
const reply = (body: unknown, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store'}})
export async function POST(request: Request) {
 const origin = request.headers.get('origin')
 if (origin && origin !== new URL(request.url).origin) return reply({error:'Invalid origin.'},403)
 const text = await request.text()
 if (text.length > 4096) return reply({error:'Request too large.'},413)
 let b: Record<string, unknown>
 try { b = JSON.parse(text); if (!b || Array.isArray(b) || typeof b !== 'object') throw new Error() } catch { return reply({error:'Invalid request.'},400) }
 const str = (v: unknown) => typeof v === 'string' ? v.trim() : ''
 if (str(b.company)) return reply({error:'Unable to accept this request.'},400)
 const name=str(b.name), contact=str(b.contact).toLowerCase(), relationship=str(b.relationship), requestId=str(b.requestId)
 const feedback=str(b.feedback)
 if (feedback.length>1500) return reply({error:'Please keep feedback under 1,500 characters.'},400)
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
 const phone=/^\+?[0-9 ()-]{7,25}$/.test(contact) && contact.replace(/\D/g,'').length>=7
 if (!name || name.length>100 || contact.length>320 || (!email && !phone) || !Number.isInteger(b.childAge) || Number(b.childAge)<0 || Number(b.childAge)>17 || !['caregiver','network'].includes(relationship) || typeof b.updates!=='boolean' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return reply({error:'Please check your details.'},400)
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY
 if (!url || !key) return reply({error:'Registration is temporarily unavailable. Please try again later.'},503)
 const visitor=createHash('sha256').update(key).update(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown').digest('hex')
 try {
 const res=await fetch(`${url}/rest/v1/rpc/proof_register_interest_v2`,{method:'POST',headers:{apikey:key,authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({p_request_id:requestId,p_name:name,p_contact:contact,p_child_age:b.childAge,p_relationship:relationship,p_updates:b.updates,p_source:str(b.source).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,64)||'proof',p_visitor:visitor,p_feedback:feedback})})
 if (!res.ok) { const error=await res.text();return reply({error:error.includes('proof_rate_limit')?'Too many attempts. Please try again later.':'Your details were not saved. Please try again.'},error.includes('proof_rate_limit')?429:502) }
 const rows=await res.json();const receipt=rows?.[0]?.receipt
 if (typeof receipt!=='string') return reply({error:'Your details were not saved. Please try again.'},502)
 await notifyProofInterest(receipt)
 return reply({ok:true,receipt})
 } catch { return reply({error:'Your details were not saved. Please try again.'},502) }
}
