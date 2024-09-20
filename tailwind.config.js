/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFA500", // 밝은 오렌지 컬러
        secondary: {
          100: "#FFDAB6", // 연한 살구색
          200: "#EE8A2C" // 진한 오랜지 색
          // orange: "#FF7B00"
        }
      }
    }
  },
  plugins: []
};
