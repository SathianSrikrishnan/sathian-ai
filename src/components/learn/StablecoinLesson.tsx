'use client'
import { useReducer, useRef } from 'react'
import { initialStablecoinState, stablecoinLesson, stablecoinTransition, STABLECOIN_STEPS } from '@/lib/learn/stablecoin'
export function StablecoinLesson() {
 const [state, dispatch] = useReducer(stablecoinTransition, undefined, initialStablecoinState)
 const heading=useRef<HTMLHeadingElement>(null)
 const step=STABLECOIN_STEPS[state.step]
 function advance() { dispatch({type:'continue'}); requestAnimationFrame(()=>heading.current?.focus()) }
 function reset() { dispatch({type:'reset'}); requestAnimationFrame(()=>heading.current?.focus()) }
 return <section className="learn-stablecoin" aria-label="USDC questions">
  <p>USDC is a stablecoin: a digital token designed to stay worth one US dollar.</p>
  <div className={`learn-token-model token-step-${state.step}`} aria-label="A pretend dollar in reserves, a USDC token and two wallets"><div className="learn-reserve-box"><span>Reserves</span><strong>$1</strong></div><span aria-hidden="true">↔</span><div className="learn-token">USDC</div><span aria-hidden="true">↔</span><div className="learn-wallet-box"><span>Wallet A</span><span>Wallet B</span></div></div>
  {state.complete ? <div className="learn-stablecoin-complete"><h3 ref={heading} tabIndex={-1}>You explored USDC.</h3><p>Create a token. Transfer it. Redeem it. A stable price is not the same as steady shopping prices.</p><button className="learn-button" onClick={reset}>Try again</button></div> : <>
   <p className="learn-step-count">{state.step+1} / {STABLECOIN_STEPS.length}</p><h3 ref={heading} tabIndex={-1}>{step.title}</h3><p>{step.text}</p>
   <fieldset><legend>{step.question}</legend><div className="learn-stablecoin-answers">{(['yes','no'] as const).map(answer=><button key={answer} type="button" className="learn-answer" disabled={state.choice!==null} aria-pressed={state.choice===answer} onClick={()=>dispatch({type:'answer',answer})}>{answer==='yes'?'Yes':'No'}</button>)}</div></fieldset>
   {state.choice && <div className="learn-stablecoin-response" aria-live="polite"><p>{step.explanation}</p><button className="learn-button" onClick={advance}>Continue</button></div>}
   <button className="learn-reset" onClick={reset}>Start again</button>
  </>}
  <aside className="learn-stablecoin-note"><p>USDC reserves include cash, short-term US Treasuries and Treasury-backed agreements. Buying existing USDC isn’t minting. Direct redemption has eligibility requirements and possible fees. USDC isn’t an insured bank deposit; its market price can differ from $1.</p><nav aria-label="USDC sources">{stablecoinLesson.sources.map(source=><a key={source.url} href={source.url}>{source.title}</a>)}</nav></aside>
 </section>
}

