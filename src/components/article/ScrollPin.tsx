'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function ScrollPin({
  children,
  duration = 1,
  accent,
}: {
  children: React.ReactNode
  duration?: number
  accent?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !innerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top center',
        end: `+=${duration * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
      },
    })

    // Scale up slightly and add glow
    tl.fromTo(
      innerRef.current,
      { scale: 0.95, opacity: 0.7 },
      { scale: 1, opacity: 1, duration: 0.5 }
    )
    tl.to(
      innerRef.current,
      { scale: 1.02, duration: 0.3 },
      '+=0.2'
    )
    tl.to(
      innerRef.current,
      { scale: 1, opacity: 0.9, duration: 0.3 }
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === ref.current) t.kill()
      })
    }
  }, [duration])

  return (
    <div ref={ref} className="my-16">
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  )
}
