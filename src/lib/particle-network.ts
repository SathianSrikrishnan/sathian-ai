/**
 * Canvas 2D Particle Network Engine
 * Renders glowing nodes, constellation lines, and a traveling tooth particle.
 * Designed to be driven by GSAP ScrollTrigger (progress 0-1).
 */

export interface ParticleNetworkOptions {
  nodeCount: number
  connectionRadius: number
  colors?: string[]
  bgColor?: string
  glowIntensity?: number
}

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  brightness: number
  brightnessSpeed: number
  driftAngle: number
  driftSpeed: number
  color: string
  connections: number[]
}

interface TrailPoint {
  x: number
  y: number
  alpha: number
}

const DEFAULT_COLORS = ["#7C3AED", "#06B6D4", "#EC4899", "#F59E0B", "#A78BFA", "#22D3EE"]

export class ParticleNetwork {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private particles: Particle[] = []
  private trail: TrailPoint[] = []
  private width = 0
  private height = 0
  private options: Required<ParticleNetworkOptions>
  private toothX = 0
  private toothY = 0
  private pulses: { x: number; y: number; progress: number }[] = []

  constructor(canvas: HTMLCanvasElement, options: ParticleNetworkOptions) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.options = {
      nodeCount: options.nodeCount,
      connectionRadius: options.connectionRadius,
      colors: options.colors ?? DEFAULT_COLORS,
      bgColor: options.bgColor ?? "#050510",
      glowIntensity: options.glowIntensity ?? 1,
    }
    this.resize()
    this.generateNodes()
  }

  resize() {
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
    const rect = this.canvas.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height
    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr
    this.ctx.scale(dpr, dpr)
  }

  private generateNodes() {
    const { nodeCount, connectionRadius, colors } = this.options
    this.particles = []

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      this.particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: 1.5 + Math.random() * 2,
        brightness: 0.4 + Math.random() * 0.6,
        brightnessSpeed: 0.005 + Math.random() * 0.01,
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: 0.0003 + Math.random() * 0.001,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
      })
    }

    // Pre-compute connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].baseX - this.particles[j].baseX
        const dy = this.particles[i].baseY - this.particles[j].baseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < connectionRadius) {
          this.particles[i].connections.push(j)
        }
      }
    }
  }

  /**
   * Main update loop. Call from GSAP's onUpdate.
   * @param progress - 0 to 1 from ScrollTrigger
   * @param time - current timestamp for organic motion
   */
  update(progress: number, time: number = Date.now() * 0.001) {
    const { ctx, width, height, options } = this

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = options.bgColor
    ctx.fillRect(0, 0, width, height)

    // Fade-in particles based on progress
    const visibleCount = Math.floor(this.particles.length * Math.min(progress * 1.5, 1))

    // Update particle positions (organic drift)
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      p.driftAngle += p.driftSpeed
      p.x = p.baseX + Math.sin(p.driftAngle + time * 0.3) * 8
      p.y = p.baseY + Math.cos(p.driftAngle * 0.7 + time * 0.2) * 6
      p.brightness = 0.4 + Math.sin(time * p.brightnessSpeed * 60 + i) * 0.3
    }

    // Draw connections (constellation lines)
    ctx.globalCompositeOperation = "lighter"
    for (let i = 0; i < visibleCount; i++) {
      const p = this.particles[i]
      for (const j of p.connections) {
        if (j >= visibleCount) continue
        const q = this.particles[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const alpha = (1 - dist / options.connectionRadius) * 0.25 * progress
        if (alpha <= 0) continue

        ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }
    }

    // Draw glowing nodes
    for (let i = 0; i < visibleCount; i++) {
      const p = this.particles[i]
      const intensity = options.glowIntensity

      // Outer glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5)
      gradient.addColorStop(0, this.hexToRgba(p.color, 0.6 * p.brightness * intensity))
      gradient.addColorStop(0.4, this.hexToRgba(p.color, 0.15 * p.brightness * intensity))
      gradient.addColorStop(1, "transparent")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2)
      ctx.fill()

      // Core dot
      ctx.fillStyle = this.hexToRgba(p.color, p.brightness)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Update tooth particle
    if (visibleCount > 1) {
      const pathIndex = Math.floor(progress * (visibleCount - 1))
      const pathFraction = (progress * (visibleCount - 1)) % 1
      const from = this.particles[Math.min(pathIndex, visibleCount - 1)]
      const to = this.particles[Math.min(pathIndex + 1, visibleCount - 1)]
      this.toothX = from.x + (to.x - from.x) * pathFraction
      this.toothY = from.y + (to.y - from.y) * pathFraction

      // Add to trail
      this.trail.push({ x: this.toothX, y: this.toothY, alpha: 1 })
      if (this.trail.length > 30) this.trail.shift()

      // Draw trail
      for (let i = 1; i < this.trail.length; i++) {
        const alpha = (i / this.trail.length) * 0.6
        ctx.strokeStyle = `rgba(255, 200, 100, ${alpha})`
        ctx.lineWidth = 2 * (i / this.trail.length)
        ctx.beginPath()
        ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y)
        ctx.lineTo(this.trail[i].x, this.trail[i].y)
        ctx.stroke()
      }

      // Draw tooth particle (bright golden orb)
      const toothGrad = ctx.createRadialGradient(
        this.toothX, this.toothY, 0,
        this.toothX, this.toothY, 12
      )
      toothGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)")
      toothGrad.addColorStop(0.3, "rgba(245, 158, 11, 0.7)")
      toothGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.2)")
      toothGrad.addColorStop(1, "transparent")
      ctx.fillStyle = toothGrad
      ctx.beginPath()
      ctx.arc(this.toothX, this.toothY, 12, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw verification pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i]
      pulse.progress += 0.02
      if (pulse.progress > 1) {
        this.pulses.splice(i, 1)
        continue
      }
      const radius = pulse.progress * 30
      const alpha = 1 - pulse.progress
      ctx.strokeStyle = `rgba(100, 255, 200, ${alpha})`
      ctx.lineWidth = 2 * alpha
      ctx.beginPath()
      ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.globalCompositeOperation = "source-over"
  }

  /** Trigger a verification pulse at a node */
  triggerPulse(nodeIndex: number) {
    if (nodeIndex < this.particles.length) {
      const p = this.particles[nodeIndex]
      this.pulses.push({ x: p.x, y: p.y, progress: 0 })
    }
  }

  /** Reset and regenerate with new count */
  setNodeCount(count: number) {
    this.options.nodeCount = count
    this.generateNodes()
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  destroy() {
    this.particles = []
    this.trail = []
    this.pulses = []
  }
}
