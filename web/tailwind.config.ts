import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.2, 1.1, 0.2, 1)',
      },
      boxShadow: {
        paper: '0 18px 40px rgba(0,0,0,0.45)',
        lift: '0 10px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config
