/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('../public/assets/bg.png')",
      },
    },
    fontFamily: {
      orbitron: ["Orbitron"],
      pop: ["Poppins"],
    },
  },

  plugins: [],
};
