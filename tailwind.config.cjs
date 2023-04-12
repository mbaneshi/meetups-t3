/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "835px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "450px",
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
