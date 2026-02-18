'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ChatWidget } from '@/components/ChatWidget'

const C = {
  bg: '#050510',
  nebula: '#7C3AED',
  aurora: '#06B6D4',
  text: '#F1F5F9',
  muted: '#A78BFA',
}

export default function VoiceAboutPage() {
  return (
    <div className="min-h-screen relative" style={{ background: C.bg, color: C.text }}>
      {/* Aurora ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-[150px] right-[10%] h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{ background: `radial-gradient(circle, ${C.nebula}, transparent 70%)` }}
        />
        <div
          className="absolute -left-[80px] bottom-[15%] h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${C.aurora}, transparent 70%)` }}
        />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 px-6 py-4 glass">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-mono hover:underline" style={{ color: C.muted + '80' }}>
            &larr; sathian.ai
          </Link>
          <Link
            href="/voice"
            className="text-sm font-mono transition-colors"
            style={{ color: C.aurora + '80' }}
          >
            Try Kai Voice &rarr;
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-display-sm md:text-display-md font-bold mb-8">
            Kai Voice
          </h1>
        </motion.div>

        {/* What is Kai */}
        <motion.div
          className="space-y-5 text-base leading-relaxed"
          style={{ color: C.text + 'cc' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p>
            Kai is my second brain. A public digital assistant.
            Model-agnostic &mdash; intelligence is locally stored.
          </p>
          <p>
            The chat widget on this site is the public layer. It knows my work,
            my projects, and my thinking. The private version knows everything &mdash;
            it runs on my own infrastructure, stores context on my own machine,
            and helps me think, build, and execute.
          </p>
          <p>
            Kai Voice is the spoken interface. Same assistant, same context &mdash;
            but you talk to it and it talks back. Voice access is private for now.
          </p>
          <p>
            Kai is what happens when you stop chasing the latest model and start
            investing in context. Context is what makes AI powerful &mdash; not the
            model itself.
          </p>
        </motion.div>

        {/* Human 3.0 */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-semibold mb-4" style={{ color: C.text }}>Human 3.0</h2>
          <div className="space-y-5 text-base leading-relaxed" style={{ color: C.text + 'cc' }}>
            <p>
              What happens when you stop asking &ldquo;what can AI do?&rdquo; and start
              asking &ldquo;what are <em>you</em> trying to do?&rdquo;
            </p>
            <p>
              Context over model. Your data stays on your infrastructure. Privacy
              isn&rsquo;t a feature &mdash; it&rsquo;s a foundation. Markdown, not vendor
              lock-in. If you can&rsquo;t move it, you don&rsquo;t own it. AI that makes
              you more capable, not more dependent. Tools that extend, not replace.
            </p>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          className="mt-12 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { label: 'Fabric', href: 'https://github.com/danielmiessler/fabric', color: C.aurora },
            { label: 'Daniel Miessler', href: 'https://github.com/danielmiessler', color: C.muted },
            { label: 'Network School', href: 'https://www.networkschool.io', color: C.aurora },
            { label: 'Open-source projects', href: 'https://github.com/anthropics/claude-code', color: C.muted },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: link.color,
              }}
            >
              {link.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          ))}
        </motion.div>

        {/* Closing */}
        <motion.div
          className="mt-20 pt-12 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap gap-4">
            <Link
              href="/voice"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-mono transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${C.nebula}20, ${C.aurora}15)`,
                border: `1px solid ${C.nebula}30`,
                color: C.text,
              }}
            >
              Try Kai Voice
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-mono transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: C.muted,
              }}
            >
              Explore Projects
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </main>

      <ChatWidget />
    </div>
  )
}
