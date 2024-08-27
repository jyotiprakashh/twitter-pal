/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },

      colors: {
        "X-black": "#14171A",
        "X-gray": "#191d21",
        "X-lightBlack": "#192734",
        "X-darkBlack": "#15202b",
        "X-Darkgray" : "#657786",
        "X-Lightgray" : "##AAB8C2",
        "X-Extralightgray": "#E1E8ED",
        "X-extraextralightgray": "#F5F8FA",
        "X-blue" : "#1DA1F2",
      },
      animation: {
        
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
