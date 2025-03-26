import React from 'react'
import ReactDOM from 'react-dom/client'

import '@hedron/ui-core/icons.css'
import '@hedron/ui-core/fonts.css'
import '@hedron/ui-core/base.css'
import '@hedron/ui-core/modules.css'

import { App } from '@components/App/App'

import '@renderer/windows'
import '@renderer/ipc/mainThreadListen'
import '@renderer/engine'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
