import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifyProofInterest } from '@/lib/proof-notification'
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals()})
function setup(){vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://sample.supabase.co');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','test');vi.stubEnv('RESEND_API_KEY','test')}
describe('PROOF owner email',()=>{
 it('uses one fixed owner destination and a stable idempotency key without child data',async()=>{
  setup();const f=vi.fn().mockResolvedValueOnce(Response.json([{adult_name:'Sample Adult',contact:'sample@example.invalid',feedback:'Clearer please',notification_id:null}])).mockResolvedValueOnce(Response.json({id:'email-1'})).mockResolvedValueOnce(new Response(null,{status:204}));vi.stubGlobal('fetch',f)
  await notifyProofInterest('receipt-1');const sent=JSON.parse(f.mock.calls[1][1].body)
  expect(sent.to).toEqual(['info@toothfairy.network']);expect(f.mock.calls[1][1].headers['Idempotency-Key']).toBe('proof-interest-receipt-1');expect(sent).not.toHaveProperty('child_age');expect(JSON.parse(f.mock.calls[2][1].body)).toMatchObject({notification_id:'email-1',notification_status:'accepted'})
 })
 it('does not send an accepted notification again',async()=>{setup();const f=vi.fn().mockResolvedValueOnce(Response.json([{notification_id:'email-1'}]));vi.stubGlobal('fetch',f);await notifyProofInterest('receipt-1');expect(f).toHaveBeenCalledTimes(1)})
 it('keeps provider failures pending without failing registration',async()=>{setup();const f=vi.fn().mockResolvedValueOnce(Response.json([{adult_name:'Sample',contact:'sample@example.invalid'}])).mockResolvedValueOnce(new Response(null,{status:503})).mockResolvedValueOnce(new Response(null,{status:204}));vi.stubGlobal('fetch',f);await expect(notifyProofInterest('receipt-1')).resolves.toBeUndefined();expect(JSON.parse(f.mock.calls[2][1].body).notification_status).toBe('pending')})
})
