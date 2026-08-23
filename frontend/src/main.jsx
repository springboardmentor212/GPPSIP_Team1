import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Strict Frontend Env Validation
if (!import.meta.env.VITE_API_URL) {
  console.error("%c[Config Error] Missing VITE_API_URL in frontend environment variables. Features requiring backend connectivity will fail.", "color: red; font-size: 14px; font-weight: bold;");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
