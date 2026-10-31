const BENEFITS = [
  { kind: 'proof', text: 'Printed Proof of Growth' },
  { kind: 'note', text: 'A note from you' },
  { kind: 'wallet', text: 'A digital wallet' },
  { kind: 'parent', text: 'The parent holds the key' },
] as const

// Small line sketches explain the gift without adding another heading.
export function NetworkBenefits() {
  return <ul className="network-benefits">
    {BENEFITS.map(({ kind, text }) => <li key={kind}>
      <svg viewBox="0 0 40 40" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {kind === 'proof' && <><path d="m10 6 20 1-1 28-20-1Z M13 7l-1 26 M17 12l9 1 M17 17l8-1 M17 26l3-5 5 6Z" /><path d="m20 21 2-3 3 9" /></>}
        {kind === 'note' && <><path d="m6 13 28-1-1 20-27-1Z M7 14l13 10 13-11 M7 30l9-10 M32 30l-9-10" /><path d="M15 8c-4-5-8 3 5 7 13-5 8-12 4-7l-4 4Z" /></>}
        {kind === 'wallet' && <><path d="m10 4 21 1-1 31-20-1Z M13 9l15 1-1 17-14-1Z M17 31h7" /><path d="M20 13v9 M23 15c-7-3-7 5 0 3 5 0 0 6-6 3" /></>}
        {kind === 'parent' && <><path d="M17 16c-10 0-10-12-3-12 9-1 11 12 3 12Z M6 34l1-11c4-6 14-6 17 0l1 11 M11 25l1 8" /><path d="M28 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M28 19l-1 14 M27 27h5 M27 31h4" /></>}
      </svg>
      <span>{text}</span>
    </li>)}
  </ul>
}
