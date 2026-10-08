/** Narris International: Tailwind config holding the brand tokens. */
/** @type {import('tailwindcss').Config} */
export default {
  // Class names also live inside JS template strings (components.js, hero.js), so scan js/ too.
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Primary: Dark Azure (client brand colour #162b3a)
        azure: {
          DEFAULT: '#162b3a',
          950: '#0e1d28',
          900: '#122533',
          800: '#162b3a',
          700: '#1f3a4d',
          600: '#2c4d63',
          300: '#93a8b6', // muted text on azure, AA on #162b3a
          200: '#c3cfd7',
        },
        // Soft background: Warm Light (client brand colour #ebe6e4)
        warm: {
          DEFAULT: '#ebe6e4',
          50: '#f7f5f4',
          100: '#f1eeec',
          200: '#ebe6e4',
          300: '#ddd6d2',
        },
        // No separate accent: the palette is the client's three colours (Azure, Warm Light, White) plus azure tints.
      },
      fontFamily: {
        // TODO(client): confirm headline face
        // Headlines now use the same clean sans as body (Kantar-style). Class name `font-serif` kept so markup stays unchanged.
        serif: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { prose2: '38rem' },
      letterSpacing: { widest2: '0.22em' },
      transitionTimingFunction: { calm: 'cubic-bezier(.22,.61,.36,1)' },
    },
  },
  plugins: [],
};
