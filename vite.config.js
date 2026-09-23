import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tikwm': {
        target: 'https://www.tikwm.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tikwm/, ''),
      },
    },
  },
})