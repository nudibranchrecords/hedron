import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './base.css'

import './windows'
import './globalVars'
import './mainThreadListen'
import { EngineStateManager } from './managers/EngineStateManager'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    // TODO: create hook that mounts this only when ready (after signal from main thread)
    <EngineStateManager />
  </React.StrictMode>,
)
