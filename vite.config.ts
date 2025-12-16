import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@headlessui/react', 'lucide-react'],
          utils: ['axios', 'zustand', '@tanstack/react-query'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/woo': {
        target: 'https://planetaoutdoor.cl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/woo/, '/wp-json/wc/v3'),
        secure: true,
      },
      '/api/wp': {
        target: 'https://planetaoutdoor.cl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wp/, '/wp-json/wp/v2'),
        secure: true,
      },
      '/wp-content': {
        target: 'https://planetaoutdoor.cl',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
