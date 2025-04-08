/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        bold: '700',
      },
      colors: {
        primary: "#3861FB",
        secondary: "#F5B014",
        accent: "#E63946",
        background: "#F8F9FA",
        dark: "#1D3557",
      },
    },
  },
  plugins: [],
}; 