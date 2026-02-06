"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

interface KineticTextProps {
  children: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
  style?: React.CSSProperties
  /** Split by 'chars' | 'words' | 'lines' */
  splitBy?: "chars" | "words" | "lines"
  /** Stagger delay between each element */
  stagger?: number
  /** Total animation duration */
  duration?: number
  /** Scroll trigger or animate on mount */
  trigger?: "scroll" | "mount"
  /** Y offset to animate from */
  fromY?: number
}

export function KineticText({
  children,
  as: Tag = "h2",
  className = "",
  style,
  splitBy = "chars",
  stagger = 0.02,
  duration = 0.6,
  trigger = "scroll",
  fromY = 30,
}: KineticTextProps) {
  const ref = useRef<HTMLElement>(null)
  const splitRef = useRef<SplitText | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Split text into chars/words/lines
    const split = new SplitText(el, {
      type: splitBy,
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
    })
    splitRef.current = split

    const targets = split[splitBy] || []

    // Set initial state
    gsap.set(targets, { opacity: 0, y: fromY })

    const animConfig = {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power3.out",
    }

    if (trigger === "scroll") {
      gsap.to(targets, {
        ...animConfig,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      })
    } else {
      gsap.to(targets, animConfig)
    }

    return () => {
      split.revert()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [children, splitBy, stagger, duration, trigger, fromY])

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ ...style, visibility: "visible" }}
    >
      {children}
    </Tag>
  )
}
