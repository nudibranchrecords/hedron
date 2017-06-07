import world from './Engine/world.js'
import { displaysListUpdate } from './store/displays/actions'
let store

const url = process.env.NODE_ENV !== 'development'
 ? 'output.html' : 'http://0.0.0.0:8080/output.html'

const Screen = nw.Screen.Init()

const win = nw.Window.get()

win.on('resize', function () {
  world.setSize()
})

export const initiateScreens = (injectedStore) => {
  store = injectedStore
  store.dispatch(displaysListUpdate(nw.Screen.screens))
}

Screen.on('displayAdded', () => {
  store.dispatch(displaysListUpdate(nw.Screen.screens))
})

Screen.on('displayRemoved', () => {
  store.dispatch(displaysListUpdate(nw.Screen.screens))
})

export const sendOutput = (index) => {
  const display = nw.Screen.screens[index]
  nw.Window.open(url, {}, (outputWin) => {
    const x = display.bounds.x
    const y = display.bounds.y

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
