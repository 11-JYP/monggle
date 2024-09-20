/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard-Regular", "sans-serif"],
        Uhbee: ["UhBeeSe_hyun", "sans-serif"]
      },
      colors: {
        primary: "#FFA500",
        secondary: {
          100: "#FFDAB6",
          200: "#EE8A2C"
        }
      }
    }
  },
  plugins: []
};
