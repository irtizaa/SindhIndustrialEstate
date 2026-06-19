/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",   // ✅ make sure this line exists
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
