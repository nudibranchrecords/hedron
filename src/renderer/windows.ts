import { ScreenEvents } from 'src/shared/Events.js'

export const sendOutput = (index: number): void => {
  // const display = screen.getAllDisplays()[index]

  const outputWin = window.open('', 'modal')

  console.log(outputWin)

  if (!outputWin) throw new Error("Couldn't open window")

  // ipcRenderer.send('reposition-output-window', display)

  outputWin.document.write('<div style="width:100vw;height:100vh;"></div>')
  outputWin.document.body.style.margin = '0'
  outputWin.document.body.style.cursor = 'none'

  outputWin.addEventListener('beforeunload', () => {
    // engine.stopOutput()
  })

  setTimeout(() => {
    // engine.setOutput(outputWin)
  }, 1000)
}

window.electron.ipcRenderer.on(ScreenEvents.SendOutput, (e, index) => {
  sendOutput(index)
})

// export const openDevTools = () => {
//   ipcRenderer.send('open-dev-tools')
// }
