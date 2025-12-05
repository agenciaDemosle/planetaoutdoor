import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/woo': {
        target: 'https://planetaoutdoor.cl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/woo/, '/wp-json/wc/v3'),
        secure: true,
      },
    },
  },
})
