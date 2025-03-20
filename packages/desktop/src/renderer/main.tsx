import React from 'react'
import ReactDOM from 'react-dom/client'
import '@css/base.css'

import { App } from '@components/App/App'

import '@renderer/windows'
import '@renderer/ipc/mainThreadListen'
import '@renderer/engine'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
