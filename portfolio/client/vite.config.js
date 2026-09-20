import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

import tailwindcss from '@tailwindcss/vite' 
[react(), tailwindcss()]
