/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT")
module.exports = withMT({
  content: ["./**/*.{jsx,css}", "node_modules/flowbite-react/lib/esm/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
})
