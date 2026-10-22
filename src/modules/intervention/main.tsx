import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DeviceFrame from './DeviceFrame'
import './index.css'

const embedded = new URLSearchParams(window.location.search).has('embed')
const handheld = window.matchMedia('(pointer: coarse) and (max-width: 820px)').matches
if (embedded) document.documentElement.dataset.embed = ''

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {embedded || handheld ? <App /> : <DeviceFrame><App /></DeviceFrame>}
  </React.StrictMode>,
)
