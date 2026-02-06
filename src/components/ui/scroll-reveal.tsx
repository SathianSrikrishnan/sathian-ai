"use client"

import { motion } from "motion/react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  /** Delay before animation starts (seconds) */
  delay?: number
  /** Y offset to animate from */
  fromY?: number
  /** Animation duration */
  duration?: number
  /** Direction of reveal */
  direction?: "up" | "down" | "left" | "right"
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  fromY = 40,
  duration = 0.7,
  direction = "up",
}: ScrollRevealProps) {
  const offsets = {
    up: { y: fromY, x: 0 },
    down: { y: -fromY, x: 0 },
    left: { y: 0, x: fromY },
    right: { y: 0, x: -fromY },
  }

  const offset = offsets[direction]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset.y, x: offset.x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom cubic-bezier (ease-out expo)
      }}
    >
      {children}
    </motion.div>
  )
}
