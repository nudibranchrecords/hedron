import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './base.css'
import { refreshSketch, run } from './engine'
import './windows'
import './globalVars'
import { SketchEvents } from '../shared/Events'

window.electron.ipcRenderer.on(SketchEvents.ServerStart, (_, sketchesServerUrl) => {
  run(sketchesServerUrl)
})

window.electron.ipcRenderer.on(SketchEvents.RefreshSketch, (_, sketchId) => {
  refreshSketch(sketchId)
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
