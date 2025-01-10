/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
         extend: {
          keyframes: {
             fadeIn: {
               '0%': { opacity: '0', transform: 'translateY(10px)' },
               '100%': { opacity: '1', transform: 'translateY(0)' },
             },
             progress: {
              '0%': { width: '0%' },
              '100%': { width: '100%' }
            }
           },
           animation: {
            fadeIn: 'fadeIn 0.5s ease-out',
            'spin-reverse': 'spin 2s linear infinite reverse',
            'progress': 'progress 8s linear',
           }
         }
    },
    variants: {},
  plugins: [],
};
