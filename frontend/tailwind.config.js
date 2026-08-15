/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Outfit", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87"
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(88, 28, 135, 0.4)",
        glow: "0 0 40px rgba(168, 85, 247, 0.6)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 10% 20%, rgba(147,51,234,0.3) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(34,211,238,0.2) 0%, transparent 40%), linear-gradient(180deg, #0f0914 0%, #171023 100%)"
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    }
  },
  plugins: []
};
