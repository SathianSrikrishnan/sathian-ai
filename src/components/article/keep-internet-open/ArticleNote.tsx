'use client'

import { useRef, useState } from 'react'

export function ArticleNote() {
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const [failed, setFailed] = useState(false)

  function close() {
    video.current?.pause()
    launcher.current?.focus()
  }

  return <div className="article-note">
    <button ref={launcher} className="article-note-launch" aria-label="Play a note from Sathian" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      {/* Static portrait from the owner-approved video; no remote image request. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/keep-the-internet-open/intro-poster.jpg" alt="" width={72} height={48} />
      <span>A note from me <small>18 seconds</small></span><span aria-hidden="true">▶</span>
    </button>
    <dialog ref={dialog} className="article-note-dialog" aria-labelledby="article-note-title" onClose={close} onCancel={close} onClick={event => {
      const modal = dialog.current
      if (!modal || event.target !== modal) return
      const rect = modal.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close()
    }}>
      <div className="article-note-top"><h2 id="article-note-title">A note from me</h2><button aria-label="Close video" onClick={() => dialog.current?.close()}>×</button></div>
      <video ref={video} controls playsInline preload="none" poster="/media/keep-the-internet-open/intro-poster.jpg" onError={() => setFailed(true)}>
        <source src="/media/keep-the-internet-open/sathian-intro-v1.mp4" type="video/mp4" />
        <track kind="captions" src="/media/keep-the-internet-open/sathian-intro-v1.vtt" srcLang="en" label="English" />
      </video>
      {failed && <p role="status">The video couldn’t load. <a href="/media/keep-the-internet-open/sathian-intro-v1.mp4">Open the video directly.</a></p>}
      <small className="article-note-disclosure">Sathian · AI-generated avatar</small>
    </dialog>
  </div>
}
