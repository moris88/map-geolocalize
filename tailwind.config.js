/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,html,js}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
        },
        screens: {
          DEFAULT: "100%",
        },
      },
      colors: {
        primary: {
          DEFAULT: "#C9102E",
        },
        secondary: {
          DEFAULT: "#B10B25",
        },
      },
      fontSize: {
        "4xl": [
          "2.50rem",
          {
            lineHeight: "normal",
          },
        ],
      },
    },
  },
  plugins: [],
};
