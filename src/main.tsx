import React from 'react'
import ReactDOM from 'react-dom/client'
// 用 HashRouter 彻底解决 404 问题，无需 basename
import { HashRouter } from 'react-router-dom'
import App from './App'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
