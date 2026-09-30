import "@fontsource/atkinson-hyperlegible/400.css"
import "@fontsource/atkinson-hyperlegible/700.css"
import "@fontsource/newsreader/400.css"
import "@fontsource/newsreader/500.css"
import "@fontsource/newsreader/600.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
