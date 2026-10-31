const BENEFITS = [
  { kind: 'proof', text: 'Printed Proof of Growth' },
  { kind: 'note', text: 'A note from you' },
  { kind: 'wallet', text: 'A digital wallet' },
  { kind: 'parent', text: 'The parent holds the key' },
] as const

// Small colored item sketches explain the gift without adding another heading.
export function NetworkBenefits() {
  return <ul className="network-benefits">
    {BENEFITS.map(({ kind, text }) => <li key={kind}>
      <svg viewBox="0 0 40 40" width="30" height="30" fill="none" stroke="#4a4338" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {kind === 'proof' && <><path d="m10 6 20 1-1 28-20-1Z" fill="#246b57" stroke="#164b3d" /><path d="m13 7-1 26 M29 30l-15-1" stroke="#e5c76b" /><path d="m16 12 10 1-1 13-10-1Z" fill="#fff7e5" stroke="none" /><circle cx="20" cy="17" r="2" fill="#e3b844" stroke="none" /><path d="m17 23 4-4 3 5" stroke="#cf7787" /></>}
        {kind === 'note' && <><path d="m7 12 26 1-1 20-26-1Z" fill="#f4dfaa" stroke="#9b7745" /><path d="m10 7 20 1-1 18-19-1Z" fill="#fffaf0" stroke="#b69c74" /><path d="m6 16 14 9 13-9-1 17-26-1Z" fill="#f7e7bd" stroke="#9b7745" /><path d="M16 12c-3-4-6 2 4 6 10-4 7-10 4-6l-4 3Z" fill="#d87788" stroke="#b9576c" /></>}
        {kind === 'wallet' && <><rect x="9" y="3" width="23" height="34" rx="4" fill="#345e72" stroke="#25414e" /><rect x="12" y="8" width="17" height="22" rx="1" fill="#eef7ec" stroke="none" /><path d="M17 5h7 M18 33h5" stroke="#fff5dc" /><path d="m15 13 10-1v6H15Z" fill="#78a6b6" stroke="#396777" /><text x="14" y="25" stroke="none" fill="#246b57" fontSize="6" fontWeight="700">US$10</text></>}
        {kind === 'parent' && <><path d="M6 35l1-11c4-6 14-6 17 0l1 11Z" fill="#b59acb" stroke="#775a91" /><path d="M17 16c-10 0-10-12-3-12 9-1 11 12 3 12Z" fill="#e8bd8f" stroke="#99744e" /><path d="M28 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M28 19l-1 15h4v-4h3v-4h-6" fill="#e7bd4e" stroke="#9f741d" /><circle cx="28" cy="14" r="1.5" fill="#fff8df" stroke="none" /></>}
      </svg>
      <span>{text}</span>
    </li>)}
  </ul>
}
