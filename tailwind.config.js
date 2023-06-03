/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
