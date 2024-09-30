import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App/App'
import './css/base.css'

import './windows'
import './globalVars'
import './ipc/mainThreadListen'
import './engine'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
