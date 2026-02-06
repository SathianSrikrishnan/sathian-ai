"use client"

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

export interface ScrollSceneProps {
  children: React.ReactNode
  id: string
  /** How many viewports of scroll distance this scene occupies */
  scrollLength?: number
  /** Called with progress 0-1 as user scrolls through scene */
  onProgress?: (progress: number) => void
  /** Additional className for the container */
  className?: string
  /** Whether to snap to scene boundaries */
  snap?: boolean
}

export interface ScrollSceneRef {
  container: HTMLDivElement | null
  timeline: gsap.core.Timeline | null
}

export const ScrollScene = forwardRef<ScrollSceneRef, ScrollSceneProps>(
  function ScrollScene(
    { children, id, scrollLength = 200, onProgress, className = "", snap = false },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<gsap.core.Timeline | null>(null)

    useImperativeHandle(ref, () => ({
      container: containerRef.current,
      timeline: timelineRef.current,
    }))

    useGSAP(
      () => {
        if (!containerRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${scrollLength}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              onProgress?.(self.progress)
            },
            ...(snap
              ? {
                  snap: {
                    snapTo: "labelsDirectional",
                    duration: { min: 0.2, max: 0.5 },
                    ease: "power1.inOut",
                  },
                }
              : {}),
          },
        })

        timelineRef.current = tl

        return () => {
          tl.kill()
        }
      },
      { scope: containerRef, dependencies: [scrollLength, snap] }
    )

    return (
      <section
        ref={containerRef}
        id={id}
        className={`relative h-screen w-full overflow-hidden ${className}`}
      >
        {children}
      </section>
    )
  }
)
