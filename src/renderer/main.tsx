import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './base.css'

import './windows'
import './globalVars'
import './mainThreadListen'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
