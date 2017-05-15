import world from './Engine/world.js'

const url = process.env.NODE_ENV !== 'development'
 ? 'output.html' : 'http://0.0.0.0:8080/output.html'

nw.Screen.Init()

const win = nw.Window.get()
const externalDisplay = nw.Screen.screens[1]

win.on('resize', function () {
  world.setSize()
})

export const sendOutput = () => {
  if (externalDisplay) {
    nw.Window.open(url, {}, (outputWin) => {
      const x = externalDisplay.bounds.x
      const y = externalDisplay.bounds.y

      outputWin.moveTo(x, y)
      outputWin.maximize()
      outputWin.enterFullscreen()

      outputWin.on('loaded', function () {
        // Don't do anything until fullscreen animation is definitely over
        setTimeout(() => {
          world.setOutput(outputWin.window.document.querySelector('#output'))
        }, 3000)
      })
    })
  }
}
