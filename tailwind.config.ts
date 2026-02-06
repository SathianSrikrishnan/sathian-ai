import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Existing app colors (keep for main site)
        primary: '#0066FF',
        accent: '#00D4AA',
        dark: '#0D1117',
        light: '#F0F6FC',

        // Direction A: Midnight Storybook
        midnight: {
          bg: '#0B0E1F',
          surface: '#141832',
          lavender: '#B794F6',
          gold: '#F6C857',
          teal: '#5EEAD4',
          pink: '#F9A8D4',
          text: '#E2E8F0',
          muted: '#94A3B8',
        },

        // Direction B: Cosmic Fairy Network
        cosmic: {
          bg: '#050510',
          surface: '#0F0F2D',
          nebula: '#7C3AED',
          aurora: '#06B6D4',
          stardust: '#F59E0B',
          plasma: '#EC4899',
          text: '#F1F5F9',
          muted: '#A78BFA',
        },

        // Direction C: Pastel Dreamscape
        pastel: {
          bg: '#F8F4FF',
          surface: '#FFFFFF',
          lilac: '#E8D5F5',
          mint: '#A7F3D0',
          gold: '#FDE68A',
          rose: '#FCA5A5',
          text: '#4A4063',
          muted: '#9CA3AF',
        },

        // Shared tooth fairy colors
        tooth: {
          healthy: '#FFFEF5',
          wiggly: '#FFE4B5',
          lost: '#9DC183',
          gum: '#F4A0A8',
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      fontSize: {
        'display-sm': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-2xl': ['6rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'display': '-0.02em',
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'fairy-trail': 'fairyTrail 1.5s ease-out forwards',
        'aurora-drift': 'auroraDrift 20s ease-in-out infinite',
        'aurora-drift-reverse': 'auroraDrift 25s ease-in-out infinite reverse',
        'aurora-breathe': 'auroraBreathe 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite alternate',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(183, 148, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(183, 148, 246, 0.6), 0 0 40px rgba(183, 148, 246, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fairyTrail: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.3) translateY(-50px)' },
        },
        auroraDrift: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        auroraBreathe: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.25' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 30px rgba(124,58,237,0.15), 0 0 60px rgba(6,182,212,0.08)' },
          '100%': { boxShadow: '0 0 50px rgba(124,58,237,0.25), 0 0 100px rgba(6,182,212,0.15)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-heavy': '24px',
      },
    },
  },
  plugins: [],
}
export default config
