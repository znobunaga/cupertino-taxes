/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'bone-white': '#f5f5dc', // Add custom color for bone white
        'bright-blue': '#2b3e50', // Add custom background blue
      },
    },
  },
  plugins: [],
}
