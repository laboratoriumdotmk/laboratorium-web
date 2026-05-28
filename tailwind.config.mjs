/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-spectral)', 'Georgia', "'Times New Roman'", 'serif'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', "'Courier New'", 'monospace'],
      },
      colors: {
        cream: '#F4EFE6',
        'cream-dark': '#EBE4D8',
        ink: '#141210',
        'ink-faded': '#3A3632',
        'ink-muted': '#7A7268',
        'lab-accent': '#E5402A',
        'lab-accent-hover': '#C83220',
        'lab-accent-pale': '#FAE8E5',
        rule: '#D4CEC4',
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              '--tw-prose-bullets': '#E5402A',
              '--tw-prose-quote-borders': '#E5402A',
              h1: { fontFamily: 'var(--font-spectral)', fontWeight: '400', letterSpacing: '-0.03em' },
              h2: { fontFamily: 'var(--font-spectral)', fontWeight: '400', letterSpacing: '-0.02em' },
              h3: { fontFamily: 'var(--font-spectral)', fontWeight: '400' },
            },
          ],
        },
        base: {
          css: [{ h1: { fontSize: '2.25rem' }, h2: { fontSize: '1.5rem', fontWeight: '600' } }],
        },
        md: {
          css: [{ h1: { fontSize: '3.25rem' }, h2: { fontSize: '2rem' } }],
        },
      },
    },
  },
}

export default config
