import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://finance-tracker-api-xy6e.onrender.com',  // ← Quotes were missing!
        changeOrigin: true,
        secure: true
      }
    }
  }
})