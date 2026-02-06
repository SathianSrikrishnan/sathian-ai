'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'

export function SectionHeading({
  children,
  accent,
  index = 0,
}: {
  children: string
  accent: string
  index?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const split = new SplitText(ref.current, { type: 'chars,words' })

    gsap.from(split.chars, {
      opacity: 0,
      y: 40,
      rotateX: -60,
      duration: 0.7,
      stagger: 0.025,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      split.revert()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === ref.current) t.kill()
      })
    }
  }, [])

  return (
    <h3
      ref={ref}
      className="text-2xl md:text-3xl font-bold text-[#E6EDF3] mb-8 mt-4 font-article"
      style={{
        perspective: '600px',
        borderLeft: `3px solid ${accent}`,
        paddingLeft: '16px',
      }}
    >
      {children}
    </h3>
  )
}
