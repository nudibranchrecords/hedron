import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './base.css'
import { run } from './engine'
import './windows'
import './globalVars'

window.electron.ipcRenderer.on('new-sketch', (e, code) => {
  const test = import(`data:text/javascript,${code}`).then((s) => {
    const sketch = new s.TestSketch({ sketchesDir: '/Users/alex/Desktop/' })

    run(sketch)
  })
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
