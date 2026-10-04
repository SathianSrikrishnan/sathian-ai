import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/proof-interest/route'
const data={name:'Sample Adult',contact:'sample@example.com',childAge:6,relationship:'caregiver',updates:false,requestId:'11111111-1111-4111-8111-111111111111',source:'instagram'}
const req=(body:unknown=data,origin='https://sathian.ai')=>new Request('https://sathian.ai/api/proof-interest',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)})
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals()})
describe('proof interest',()=>{
 it('rejects cross-origin requests',async()=>expect((await POST(req(data,'https://elsewhere.example'))).status).toBe(403))
 it('rejects invalid ages and contact',async()=>{expect((await POST(req({...data,childAge:18}))).status).toBe(400);expect((await POST(req({...data,contact:'bad'}))).status).toBe(400)})
 it('does not report saved without configuration',async()=>{vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','');expect((await POST(req())).status).toBe(503)})
 it('records optional consent and returns committed receipt only',async()=>{vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://sample.supabase.co');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','test');const f=vi.fn().mockResolvedValue(Response.json([{receipt:'receipt-1'}]));vi.stubGlobal('fetch',f);const r=await POST(req());expect(await r.json()).toEqual({ok:true,receipt:'receipt-1'});const sent=JSON.parse(f.mock.calls[0][1].body);expect(sent.p_updates).toBe(false);expect(sent.p_visitor).toHaveLength(64);expect(sent.p_request_id).toBe(data.requestId)})
 it('fails closed on missing database receipt',async()=>{vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://sample.supabase.co');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','test');vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json([])));expect((await POST(req())).status).toBe(502)})
 it('surfaces database rate limit',async()=>{vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://sample.supabase.co');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','test');vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('proof_rate_limit',{status:400})));expect((await POST(req())).status).toBe(429)})
})
