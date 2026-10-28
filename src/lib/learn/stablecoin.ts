import type { Lesson } from './types'
export const STABLECOIN_STEPS = [
 { title: 'Create', text: 'A business sends Circle dollars. Circle creates, or mints, matching USDC, backed by reserves: money and assets set aside.', question: 'Does minting create USDC?', answer: 'yes', explanation: 'Yes. Minting creates new tokens.' },
 { title: 'Transfer', text: 'Sending USDC between wallets moves the tokens, not the reserve money.', question: 'Did the reserves move too?', answer: 'no', explanation: 'No. Only the tokens moved.' },
 { title: 'Redeem', text: 'Redeeming reverses this: Circle removes returned USDC from circulation, called burning, and sends dollars from reserves.', question: 'Can burned tokens be spent?', answer: 'no', explanation: 'No. They’re removed from circulation.' },
 { title: 'Understand stable', text: 'Backing and redemption help keep USDC near one dollar. But that dollar can buy less when shop prices rise.', question: 'Does stable mean shopping prices never rise?', answer: 'no', explanation: 'No. A dollar can buy less.' },
] as const
export type StablecoinAnswer = 'yes' | 'no'
export interface StablecoinState { step: number; choice: StablecoinAnswer | null; complete: boolean }
export const initialStablecoinState = (): StablecoinState => ({ step: 0, choice: null, complete: false })
export function stablecoinTransition(state: StablecoinState, action: { type: 'answer'; answer: StablecoinAnswer } | { type: 'continue' | 'reset' }): StablecoinState {
 if (action.type === 'reset') return initialStablecoinState()
 if (state.complete) return state
 if (action.type === 'answer') return state.choice ? state : { ...state, choice: action.answer }
 if (!state.choice) return state
 return state.step === STABLECOIN_STEPS.length - 1 ? { ...state, complete: true } : { step: state.step + 1, choice: null, complete: false }
}
export const stablecoinLesson: Lesson = {
 id: 'stablecoin', interactive: 'stablecoin', title: 'What is a stablecoin?', label: 'USDC', boardTitle: 'Stablecoins', description: 'Create, transfer and redeem a digital token.', art: '', poster: '', chapters: [],
 sources: [
  { title: 'Circle: minting and redeeming', url: 'https://help.circle.com/support/en/tokenizing-and-redeeming-usdc?id=kb_article_view&sysparm_article=KB0010781' },
  { title: 'Reserves', url: 'https://www.circle.com/transparency' },
  { title: 'USDC terms', url: 'https://www.circle.com/legal/usdc-terms' },
  { title: 'About USDC', url: 'https://www.circle.com/usdc' },
 ],
}

