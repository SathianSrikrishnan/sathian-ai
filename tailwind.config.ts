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
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'fairy-trail': 'fairyTrail 1.5s ease-out forwards',
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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
export default config
