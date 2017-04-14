import world from './Engine/world.js'

nw.Screen.Init()

const win = nw.Window.get()
const externalDisplay = nw.Screen.screens[1]

win.on('resize', function () {
  world.setSize()
})

export const sendOutput = () => {
  if (externalDisplay) {
    nw.Window.open('http://0.0.0.0:8080/output.html', {}, (outputWin) => {
      const x = externalDisplay.bounds.x
      const y = externalDisplay.bounds.y

      outputWin.moveTo(x, y)
      outputWin.maximize()
      outputWin.enterFullscreen()

      outputWin.on('loaded', function () {
        world.setOutput(outputWin.window.document.querySelector('#output'))
      })
    })
  }
}
