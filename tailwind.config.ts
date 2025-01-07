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
        'headline-1': ['6rem', { fontWeight: '300', letterSpacing: '-1.5px' }],
        'headline-2': ['3.75rem', { fontWeight: '300', letterSpacing: '-0.5px' }],
        'headline-3': ['3rem', { fontWeight: '400', letterSpacing: '0px' }],
        'headline-4': ['2.125rem', { fontWeight: '400', letterSpacing: '0.25px' }],
        'headline-5': ['1.5rem', { fontWeight: '400', letterSpacing: '0px' }],
        'headline-6': ['1.25rem', { fontWeight: '500', letterSpacing: '0px' }],
        'body-large': ['1rem', { fontWeight: '400', letterSpacing: '0.5px' }],
        'body-small': ['0.875rem', { fontWeight: '400', letterSpacing: '0.25px' }],
        'subtitle-large': ['1rem', { fontWeight: '400', letterSpacing: '0.15px' }],
        'subtitle-small': ['0.875rem', { fontWeight: '500', letterSpacing: '0.1px' }],
        'button': ['0.875rem', { fontWeight: '500', letterSpacing: '1.25px' }],
        'overline': ['0.625rem', { fontWeight: '400', letterSpacing: '1.5px' }],
        'caption': ['0.75rem', { fontWeight: '400', letterSpacing: '0.4px' }],
        'big-button': ['1.25rem', { fontWeight: '700', letterSpacing: '0px' }],
      },
      backgroundImage: {
        'regis-image': "url('https://t4.ftcdn.net/jpg/06/30/03/29/360_F_630032996_e9ani5VblvtTjKYYprfStjPwRgyhi6H7.jpg')",
        'regis-block': "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bfecda6c-9d92-43b7-9298-1adce731f786/d1yu2e4-f581f411-6fa7-46e6-886a-15ee8d88b27a.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JmZWNkYTZjLTlkOTItNDNiNy05Mjk4LTFhZGNlNzMxZjc4NlwvZDF5dTJlNC1mNTgxZjQxMS02ZmE3LTQ2ZTYtODg2YS0xNWVlOGQ4OGIyN2EuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OsxNbHItcRmtueW7j4ua8k46JC8yvT-lF1RtrKkEDB4')"
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
