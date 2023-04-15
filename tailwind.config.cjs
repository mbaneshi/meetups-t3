/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "570px",
      md: "640px",
      lg: "750px",
      xl: "1024px",
      "2xl": "1280px",
      "3xl": "1536px",
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require("@tailwindcss/typography"), require("daisyui"), ],
};
