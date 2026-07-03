/**
 * NativeWind + Tailwind config for ALLDost native app.
 *
 * Colors are the EXACT HSL values from the fitness web app's
 * globals.css so brand is 1:1 across web + native. Web uses
 * CSS variables (var(--primary)) — native can't resolve those,
 * so we hard-code the same HSL strings here.
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
        // Core surface — match web globals.css exactly
        background: 'hsl(210 16% 96%)',       // LinkedIn warm grey #f3f2ef
        foreground: 'hsl(210 25% 15%)',       // Charcoal slate #1d2226
        card: 'hsl(0 0% 100%)',                // Pure white
        border: 'hsl(210 15% 88%)',            // Soft grey border
        muted: 'hsl(210 15% 92%)',             // Muted surface
        'muted-foreground': 'hsl(210 10% 40%)', // Muted text #666

        // Brand — match web exactly
        primary: {
          DEFAULT: 'hsl(210 90% 40%)',         // LinkedIn Blue #0a66c2
          foreground: 'hsl(0 0% 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(195 85% 42%)',         // Corporate teal/cyan
          foreground: 'hsl(0 0% 100%)',
        },
        accent: {
          DEFAULT: 'hsl(32 95% 50%)',          // Warm orange
          foreground: 'hsl(0 0% 100%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 55%)',           // Warm crimson red
          foreground: 'hsl(0 0% 100%)',
        },

        // ALLDost gradient marker (matches /public/logo.svg)
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
