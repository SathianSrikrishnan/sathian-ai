export function WorkshopMachine() {
  return (
    <div className="workshop-machine" aria-hidden="true">
      <div className="workshop-machine__halo workshop-machine__halo--outer" />
      <div className="workshop-machine__halo workshop-machine__halo--middle" />
      <div className="workshop-machine__halo workshop-machine__halo--inner" />
      <div className="workshop-machine__axis" />
      <div className="workshop-machine__disc workshop-machine__disc--top" />
      <div className="workshop-machine__disc workshop-machine__disc--middle" />
      <div className="workshop-machine__disc workshop-machine__disc--bottom" />
      <div className="workshop-machine__core">idea</div>
      <div className="workshop-machine__orbit workshop-machine__orbit--one"><span /></div>
      <div className="workshop-machine__orbit workshop-machine__orbit--two"><span /></div>
      <div className="workshop-machine__orbit workshop-machine__orbit--three"><span /></div>
      <div className="workshop-machine__note workshop-machine__note--input">
        <span>01 / Inputs</span>
        <i /><i /><i />
      </div>
      <div className="workshop-machine__note workshop-machine__note--system">
        <span>02 / System</span>
        <svg viewBox="0 0 92 38" role="presentation">
          <path d="M7 20h20l8-10 14 20 10-12h25" />
          <circle cx="7" cy="20" r="3" />
          <circle cx="84" cy="18" r="3" />
        </svg>
      </div>
      <div className="workshop-machine__note workshop-machine__note--output">
        <span>03 / Output</span>
        <i /><i />
      </div>
      <p className="workshop-machine__caption">Ideas, engineered into working systems.</p>
    </div>
  )
}
