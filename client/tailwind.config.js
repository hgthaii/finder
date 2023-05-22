/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/index.html"],
  theme: {
    extend: {
      keyframes: {
        'scaleUp': {
          '0%': {
            'transform': 'scale(.8) translateY(1000px)',
            opacity: 0
          },
          '100%': {
            'transform': 'scale(1) translateY(0px)',
            opacity: 1
          }
        },
        'blowUpModal': {
          '0%': {
            'transform': 'scale(1)',
            opacity: 1
          },
          '100%': {
            'transform': 'scale(0)',
            opacity: 0
          }
        },
        'header': {
          '0%': {
            opacity: 1
          },
          '100%': {
            opacity: 0,
          }
        }
      },
      animation: {
        'scaleUp': 'scaleUp .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;;',
        'blowUpModal': ' blowUpModal .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards',
        'header': 'header 1s ease-in-out'
      }
    }
  },
  plugins: [],
}
