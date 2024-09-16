/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        orange: "#FF7B00",

        // 텍스트 칼라
        "text-color": "#666",
        "subtext-color": "#999"
      }
    }
  },
  plugins: []
};
