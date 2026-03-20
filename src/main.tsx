// 完全保留你原有的导入，只修正 ReactDOM 导入路径
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// 只改这一行，用 createRoot 替代旧写法，彻底解决找不到 ReactDOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 只加 basename 适配 GitHub Pages，不改变你原有路由 */}
    <BrowserRouter basename="/breast.github.io">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
