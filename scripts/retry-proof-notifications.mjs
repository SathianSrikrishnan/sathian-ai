// Run with the existing authorized site environment; never print contact data or keys.
import { notifyProofInterest } from '../src/lib/proof-notification.ts'
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY
if(!url||!key||!process.env.RESEND_API_KEY)throw new Error('Required notification configuration is unavailable')
const recent=new Date(Date.now()-23*60*60*1000).toISOString()
const response=await fetch(`${url}/rest/v1/proof_family_interest?select=id&notification_status=eq.pending&contact=not.like.*%40example.invalid&or=(notification_attempted_at.is.null,notification_attempted_at.gt.${recent})&limit=20`,{headers:{apikey:key,authorization:`Bearer ${key}`},signal:AbortSignal.timeout(10000)})
if(!response.ok)throw new Error('Unable to read pending notifications')
const rows=await response.json()
for(const row of rows)await notifyProofInterest(row.id)
console.log(`Attempted ${rows.length} pending owner notifications. Verify accepted status/provider delivery separately.`)
