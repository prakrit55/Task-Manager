// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// tailwind.config.js (or tailwind.config.ts)
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fauna One"', 'serif'],
      },
      colors: {
        primary: "#1368EC",
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
