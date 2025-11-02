import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MapWithDraw from './Draw.jsx'
import AdvancedDrawMap from './AdvanceDraw.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <MapWithDraw/>
    {/* <AdvancedDrawMap/> */}
  </StrictMode>,
)
