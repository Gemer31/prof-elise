import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'black-1/2': 'rgba(0, 0, 0, 0.5)',
      },
      screens: {
        'xs': '320px',
        '2xs': '400px',
        '3xs': '480px',
//      sm	640px
        '2sm': '704px',
//      md	768px
        '2md': '896px',
//      lg	1024px
//      xl	1280px
//      2xl	1536px
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
