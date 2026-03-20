import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 只加这一行 path 导入
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 👇 只加这一个 resolve 配置，解决 @ 别名问题
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [react()],
  // 👇 保留你原有的所有配置，只加 base 适配 GitHub Pages
  base: '/breast.github.io/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
