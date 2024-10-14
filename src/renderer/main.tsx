import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '@components/App/App'
import '@css/base.css'

import '@renderer/windows'
import '@renderer/globalVars'
import '@renderer/ipc/mainThreadListen'
import '@renderer/engine'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
