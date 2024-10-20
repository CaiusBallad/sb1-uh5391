import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'public/content.js'),
        background: resolve(__dirname, 'public/background.js')
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  publicDir: 'public'
})