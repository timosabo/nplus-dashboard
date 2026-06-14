import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /nplus-dashboard/ by default when the repo
  // is named nplus-dashboard. Change this to '/' if you use a custom domain.
  base: '/nplus-dashboard/',
})
