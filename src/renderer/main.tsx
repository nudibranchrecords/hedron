import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App/App'
import './css/base.css'

import './windows'
import './globalVars'
import './mainThreadListen'
import { EngineManager } from './managers/EngineManager'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />

    <EngineManager />
  </React.StrictMode>,
)
