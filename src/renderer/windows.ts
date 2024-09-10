import { ScreenEvents } from 'src/shared/Events.js'
import { engine } from './engine'
import { Display } from 'electron'

export const sendOutput = (display: Display): void => {
  const outputWin = window.open('', 'output-canvas')

  if (!outputWin) throw new Error("Couldn't open window")

  outputWin.document.write('<div style="width:100vw;height:100vh;"></div>')
  outputWin.document.body.style.margin = '0'
  outputWin.document.body.style.cursor = 'none'

  const { x, y } = display.bounds

  outputWin.moveTo(x, y)

  outputWin.addEventListener('beforeunload', () => {
    engine.stopOutput()
  })

  setTimeout(() => {
    engine.setOutput(outputWin)
  }, 1000)
}

window.electron.ipcRenderer.on(ScreenEvents.SendOutput, (e, index) => {
  sendOutput(index)
})

// export const openDevTools = () => {
//   ipcRenderer.send('open-dev-tools')
// }
