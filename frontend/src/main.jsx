import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from "react-redux"
import { store } from './redux/store.js'

// Prefer VITE_SERVER_URL at build time (Render static site env).
// Fallback: local API in dev, your Render backend in production builds.
const envUrl = import.meta.env.VITE_SERVER_URL
export const serverUrl = (
  envUrl !== undefined && envUrl !== null && String(envUrl).trim() !== ""
    ? String(envUrl)
    : import.meta.env.DEV
      ? "http://localhost:8000"
      : "https://realtime-socketio-chat.onrender.com"
).replace(/\/$/, "")

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Provider store={store}>
    <App />
</Provider>
</BrowserRouter>
 
)
