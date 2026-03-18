import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all local IPs (0.0.0.0)
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080, // Default to 8080 for Firebase
  },
})
