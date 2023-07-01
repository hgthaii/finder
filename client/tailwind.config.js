/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}', './public/index.html', "./node_modules/tw-elements/dist/js/**/*.js"],
    plugins: [require("tw-elements/dist/plugin.cjs")],
    darkMode: "class",
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial':
                    'linear-gradient(0deg, rgba(20,20,20,1) 0%, rgba(20,20,20,0.6111694677871149) 40%, rgba(20,20,20,0.14898459383753504) 75%, rgba(20,20,20,0.08175770308123254) 88%, rgba(20,20,20,0) 100%)',
                'gradient-top':
                    'linear-gradient(180deg, hsla(0, 0%, 8%, 0) 0, hsla(0, 0%, 8%, .15) 37%, hsla(0, 0%, 8%, .35) 47%, hsla(0, 0%, 8%, .58) 75%, #061d4f 88%, #061d4f)',
                'gradient-left': 'linear-gradient(77deg,#030014ac,transparent 85%)',
                'gradient-header': 'linear-gradient(180deg,#030014ac 10%,transparent)',
                'gradient-radial180':
                    'linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(20,20,20,1) 10%, rgba(20,20,20,0.6111694677871149) 40%, rgba(20,20,20,0.14898459383753504) 75%, rgba(20,20,20,0.08175770308123254) 88%, rgba(20,20,20,0) 100%)',
                'gradient-top-dark':
                    'linear-gradient(180deg, hsla(0, 0%, 8%, 0) 0, hsla(0, 0%, 8%, .15) 37%, hsla(0, 0%, 8%, .35) 47%, hsla(0, 0%, 8%, .58) 75%, #f2ddd8 88%, #f2ddd8)',

            },
            colors: {
                // color bg
                'main-100': '#f2ddd8',
                'main-200': '#061d4f',
                //main-300 color text
                'main-300': '#000',

            },
            keyframes: {
                scaleUp: {
                    '0%': {
                        transform: 'scale(.8) translateY(1000px)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'scale(1) translateY(0px)',
                        opacity: 1,
                    },
                },
                scaleDown: {
                    '0%': {
                        transform: 'scale(1) translateY(0)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'scale(0.5) translateY(500px)',
                        opacity: 1,
                    },
                },
                blowUpModal: {
                    '0%': {
                        transform: 'scale(1)',
                        opacity: 1,
                    },
                    '100%': {
                        transform: 'scale(0)',
                        opacity: 0,
                    },
                },
                header: {
                    '0%': {
                        opacity: 1,
                    },
                    '100%': {
                        opacity: 0,
                    },
                },
            },
            animation: {
                scaleUp: 'scaleUp .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards',
                blowUpModal: ' blowUpModal .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards',
                header: 'header 1s ease-in-out',
                scaleDown: 'scaleDown .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards',

            },
            important: true,
        },
    },
    plugins: [],
}
