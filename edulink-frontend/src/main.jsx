import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Some older libraries (like SockJS) expect a Node-style `global` object.
// This ensures `global` points to the browser global so those libs work in Vite.
if (typeof global === 'undefined') {
  // eslint-disable-next-line no-undef
  window.global = window
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

