import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base relativa: il sito funziona anche se pubblicato in una sottocartella (es. GitHub Pages)
export default defineConfig({
  plugins: [vue()],
  base: './',
})
