/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EE8A2C",
        secondary: {
          100: "#FFDAB6",
          orange: "#FF7B00"
        }
      },
      fontFamily: {
        body: ["Montserrat"]
      }
    }
  },
  plugins: []
};
