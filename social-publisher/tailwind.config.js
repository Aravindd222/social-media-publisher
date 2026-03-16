/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {

      /* -------------------
         KEYFRAME ANIMATIONS
      --------------------*/

      keyframes: {

        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },

        pageEnter: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.98)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)"
          }
        },

        cardEnter: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },

        pulseSoft: {
          "0%,100%": {
            opacity: "1"
          },
          "50%": {
            opacity: ".7"
          }
        }

      },

      /* -------------------
         ANIMATION UTILITIES
      --------------------*/

      animation: {

        fadeIn: "fadeIn 0.35s ease-in-out",

        pageEnter:
          "pageEnter 0.45s cubic-bezier(0.16,1,0.3,1)",

        cardEnter:
          "cardEnter 0.5s ease-out",

        pulseSoft:
          "pulseSoft 2s ease-in-out infinite"

      }

    }
  },

  plugins: []
}
