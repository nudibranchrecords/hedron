import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './base.css'
import { run } from './engine'
import './windows'
import './globalVars'

run()
// window.electron.ipcRenderer.on('new-sketch', async (e, code) => {
//   const sketch = await import('public/test-sketch')

//   console.log(sketch)

//   run(sketch)
// })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
