/**
 * NativeWind + Tailwind config for ALLDost native app.
 * Colors match the fitness web app so brand is consistent across surfaces.
 * Web uses CSS variables (HSL) — native bakes the same HSL values as
 * hex/rgb since NativeWind can't resolve CSS vars.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Core surface
        background: '#f3f2ef', // LinkedIn warm grey
        foreground: '#1d2226', // Charcoal slate
        card: '#ffffff',
        border: '#dde1e6',
        muted: '#e5e7eb',
        'muted-foreground': '#666666',

        // Brand
        primary: {
          DEFAULT: '#0a66c2', // LinkedIn Blue
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#12a3c4', // Corporate teal/cyan
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f97316', // Warm orange
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444', // Crimson red
          foreground: '#ffffff',
        },

        // ALLDost gradient marker (used for the A badge, hero titles)
        'brand-start': '#FF4F00',
        'brand-end': '#00C6FF',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
};
