import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const { receiveNote }=vi.hoisted(()=>({receiveNote:vi.fn()}))
vi.mock('@/app/api/agent/message/route',()=>({POST:receiveNote}))
import { POST } from '@/app/api/proof-question/route'
import { proofQuestionMarkup } from '@/lib/proof-question'
const valid={question:'A private adult question',replyEmail:'adult@example.invalid',sourcePage:'/learn',consent:true,company:''}
const request=(body:unknown=valid,origin='https://proof.sathian.ai')=>new Request('https://proof.sathian.ai/api/proof-question',{method:'POST',headers:{origin,'content-type':'application/json','idempotency-key':'question-test-key-123456'},body:JSON.stringify(body)})
beforeEach(()=>{vi.stubEnv('PUBLIC_AGENT_ENABLED','true');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','unit-only');vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://unit.supabase.co');receiveNote.mockReset()})
afterEach(()=>vi.unstubAllEnvs())
it('cannot fall back to putting private question fields in a URL',()=>{
 expect(proofQuestionMarkup).toContain('method="post" action="/api/proof-question"')
 expect(proofQuestionMarkup).toContain('No marketing signup.')
 expect(proofQuestionMarkup).not.toContain('name="child')
})
it('forwards only a purpose-consented note to existing private intake, with idempotency',async()=>{
 receiveNote.mockResolvedValue(Response.json({capabilities:{intakeStored:true},receipt:{code:'SA-ABCDEFGHIJ',deliveryStatus:'queued',message:valid.question,email:valid.replyEmail,token:'private'}},{status:202}))
 const response=await POST(request());expect(response.status).toBe(202)
 expect(await response.json()).toEqual({ok:true,receipt:{code:'SA-ABCDEFGHIJ',deliveryStatus:'queued'}})
 expect(response.headers.get('cache-control')).toBe('no-store')
 const forwarded=receiveNote.mock.calls[0][0] as Request
 expect(forwarded.headers.get('idempotency-key')).toBe('question-test-key-123456')
 expect(await forwarded.json()).toEqual({intent:'note',message:valid.question,replyEmail:valid.replyEmail,page:'/learn',consent:true})
})
it('accepts no reply email and never claims delivery before it is confirmed',async()=>{
 receiveNote.mockResolvedValue(Response.json({capabilities:{intakeStored:true},receipt:{code:'SA-ABCDEFGHIJ',deliveryStatus:'failed'}}))
 const response=await POST(request({...valid,replyEmail:''}));expect((await response.json()).receipt.deliveryStatus).toBe('failed')
 expect(await (receiveNote.mock.calls[0][0] as Request).json()).not.toHaveProperty('replyEmail')
})
it('rejects missing consent, child/marketing fields, bad email, honeypot and cross-origin before persistence',async()=>{
 for(const body of [{...valid,consent:false},{...valid,childName:'child'},{...valid,marketing:true},{...valid,replyEmail:'bad'},{...valid,company:'bot'},{...valid,question:' '},{...valid,sourcePage:'/other'}])expect((await POST(request(body))).status).toBe(400)
 expect((await POST(request(valid,'https://other.invalid'))).status).toBe(403);expect(receiveNote).not.toHaveBeenCalled()
})
it('fails closed when unavailable or storage is not confirmed, without echoing private data',async()=>{
 vi.stubEnv('PUBLIC_AGENT_ENABLED','false');expect((await POST(request())).status).toBe(503);expect(receiveNote).not.toHaveBeenCalled()
 vi.stubEnv('PUBLIC_AGENT_ENABLED','true')
 for(const result of [{capabilities:{intakeStored:false},receipt:{code:'SA-ABCDEFGHIJ',deliveryStatus:'queued'}},{capabilities:{intakeStored:true},receipt:{code:'bad',deliveryStatus:'queued'}},{capabilities:{intakeStored:true},receipt:{code:'SA-ABCDEFGHIJ',deliveryStatus:'unknown'}}]){receiveNote.mockResolvedValue(Response.json(result));expect((await POST(request())).status).toBe(502)}
 receiveNote.mockResolvedValue(Response.json({error:valid.question+' '+valid.replyEmail},{status:500}))
 expect(await (await POST(request())).text()).not.toContain(valid.question)
 receiveNote.mockRejectedValue(new Error('private backend detail'));expect((await POST(request())).status).toBe(503)
})
