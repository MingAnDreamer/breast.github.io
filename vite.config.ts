import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // HashRouter 不需要 base，直接留空，彻底避免路径错误
  base: '',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
