import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './base.css'
import { run } from './engine'
import './windows'
import './globalVars'
import { SketchEvents } from '../shared/Events'

window.electron.ipcRenderer.on(SketchEvents.NewSketch, async (e, sketchesServerUrl) => {
  run(sketchesServerUrl)
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
