import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "var(--primary--50)",
          100: "var(--primary--100)",
          200: "var(--primary--200)",
          300: "var(--primary--300)",
          400: "var(--primary--400)",
          500: "var(--primary--500)",
          600: "var(--primary--600)",
          700: "var(--primary--700)",
          800: "var(--primary--800)",
          900: "var(--primary--900)",
          950: "var(--primary--950)",
        },
        monochrome: {
          50: "var(--monochrome--50)",
          100: "var(--monochrome--100)",
          200: "var(--monochrome--200)",
          300: "var(--monochrome--300)",
          400: "var(--monochrome--400)",
          500: "var(--monochrome--500)",
          600: "var(--monochrome--600)",
          700: "var(--monochrome--700)",
          800: "var(--monochrome--800)",
          900: "var(--monochrome--900)",
          950: "var(--monochrome--950)",
        },
        green: {
          50: "var(--green--50)",
          100: "var(--green--100)",
          200: "var(--green--200)",
          300: "var(--green--300)",
          400: "var(--green--400)",
          500: "var(--green--500)",
          600: "var(--green--600)",
          700: "var(--green--700)",
          800: "var(--green--800)",
          900: "var(--green--900)",
          950: "var(--green--950)",
        },
        yellow: {
          50: "var(--yellow--50)",
          100: "var(--yellow--100)",
          200: "var(--yellow--200)",
          300: "var(--yellow--300)",
          400: "var(--yellow--400)",
          500: "var(--yellow--500)",
          600: "var(--yellow--600)",
          700: "var(--yellow--700)",
          800: "var(--yellow--800)",
          900: "var(--yellow--900)",
          950: "var(--yellow--950)",
        },
        red: {
          50: "var(--red--50)",
          100: "var(--red--100)",
          200: "var(--red--200)",
          300: "var(--red--300)",
          400: "var(--red--400)",
          500: "var(--red--500)",
          600: "var(--red--600)",
          700: "var(--red--700)",
          800: "var(--red--800)",
          900: "var(--red--900)",
          950: "var(--red--950)",
        },
        blue: {
          50: "var(--blue--50)",
          100: "var(--blue--100)",
          200: "var(--blue--200)",
          300: "var(--blue--300)",
          400: "var(--blue--400)",
          500: "var(--blue--500)",
          600: "var(--blue--600)",
          700: "var(--blue--700)",
          800: "var(--blue--800)",
          900: "var(--blue--900)",
          950: "var(--blue--950)",
        },
      },
      fontSize: {
        /* 
        -- FONT WEIGHT --
        font-thin	100;
        font-extralight 200;
        font-light 300;
        font-normal 400;
        font-medium 500;
        font-semibold 600;
        font-bold	700;
        font-extrabold 800;
        font-black 900; 
        */
        'headline-1': ['96px', { fontWeight: '300', letterSpacing: '-1.5px' }],
        'headline-2': ['60px', { fontWeight: '300', letterSpacing: '-0.5px' }],
        'headline-3': ['48px', { fontWeight: '400', letterSpacing: '0px' }],
        'headline-4': ['34px', { fontWeight: '400', letterSpacing: '0.25px' }],
        'headline-5': ['24px', { fontWeight: '400', letterSpacing: '0px' }],
        'headline-6': ['20px', { fontWeight: '500', letterSpacing: '0px' }],
        'body-large': ['16px', { fontWeight: '400', letterSpacing: '0.5px' }],
        'body-small': ['14px', { fontWeight: '400', letterSpacing: '0.25px' }],
        'subtitle-large': ['16px', { fontWeight: '400', letterSpacing: '0.15px' }],
        'subtitle-small': ['14px', { fontWeight: '500', letterSpacing: '0.1px' }],
        'button': ['14px', { fontWeight: '500', letterSpacing: '1.25px' }],
        'overline': ['10px', { fontWeight: '400', letterSpacing: '1.5px' }],
        'caption': ['12px', { fontWeight: '400', letterSpacing: '0.4px' }],
        'big-button': ['20px', { fontWeight: '700', letterSpacing: '0px' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
