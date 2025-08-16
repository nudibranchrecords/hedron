import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import '@hedron/ui-core/icons.css'
import '@hedron/ui-core/fonts.css'
import '@hedron/ui-core/base.css'

import { App } from '@components/App/App'

import '@renderer/windows'
import '@renderer/ipc/mainThreadListen'
import '@renderer/engine'
import '@renderer/utils/frameCapture'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
