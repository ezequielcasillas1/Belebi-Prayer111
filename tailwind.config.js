/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary palette (warm cream to tan)
        primary: {
          light: '#faf7f0',
          medium: '#e8dfd2',
          dark: '#c5ae91',
        },
        // Secondary palette (terracotta to peach)
        secondary: {
          dark: '#AF6E4D',
          medium: '#C98B6A',
          light: '#FFDAB9',
        },
        // Text colors
        text: {
          primary: '#1C0F0A',
          secondary: '#5C3D2E',
          muted: '#8B7355',
        },
        // UI colors
        ui: {
          background: '#faf7f0',
          card: '#FFFFFF',
          border: '#d4c4b0',
          borderLight: '#e8dfd2',
        },
      },
    },
  },
  plugins: [],
}
