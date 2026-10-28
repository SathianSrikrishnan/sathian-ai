import { expect,it } from 'vitest'
import { initialStablecoinState, stablecoinTransition, STABLECOIN_STEPS, stablecoinLesson } from '../../src/lib/learn/stablecoin'
it('completes all sixteen answer paths only after an answer and explicit Continue',()=>{
 for(let mask=0;mask<16;mask++){
  let state=initialStablecoinState()
  for(let n=0;n<4;n++){
   expect(state.step).toBe(n);expect(stablecoinTransition(state,{type:'continue'})).toBe(state)
   state=stablecoinTransition(state,{type:'answer',answer:(mask>>n)&1?'yes':'no'})
   expect(stablecoinTransition(state,{type:'answer',answer:'yes'})).toBe(state)
   expect(state.complete).toBe(false);state=stablecoinTransition(state,{type:'continue'})
  }
  expect(state.complete).toBe(true);expect(stablecoinTransition(state,{type:'continue'})).toBe(state)
  expect(stablecoinTransition(state,{type:'reset'})).toEqual(initialStablecoinState())
 }
})
it('teaches mint, transfer, burn and purchasing power without pretending a film exists',()=>{
 expect(STABLECOIN_STEPS.map(s=>s.answer)).toEqual(['yes','no','no','no'])
 expect(stablecoinLesson.watch).toBeUndefined();expect(stablecoinLesson.interactive).toBe('stablecoin')
 expect(stablecoinLesson.sources).toHaveLength(4)
})
