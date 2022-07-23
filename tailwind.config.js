/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend:{
      colors:{
        "bordeGrisClaro" : '#E9E9E9',
        "grisFormularios": '#3E4542',
        "naranjaPrincipal" : '#FF452B',
        "negro" : "#2E2E2E",
        "gris" : "#565656"
      },
      fontSize:{
        base: [
          "0.9375rem", /* 15px */
          {
            lineHeight: `${(15 * 1.5) / 16}rem` /* 22.4px */,
          },
        ]
      },
      screens: {
        'xl' : '1150px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
