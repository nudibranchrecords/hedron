import world from './Engine/world.js'
import electron from 'electron'
import { displaysListUpdate } from './store/displays/actions'
let store

const updateDisplays = () => {
  store.dispatch(displaysListUpdate(electron.screen.getAllDisplays()))
}

export const initiateScreens = (injectedStore) => {
  store = injectedStore
  updateDisplays()
}

electron.screen.on('display-added', updateDisplays)
electron.screen.on('display-removed', updateDisplays)
electron.screen.on('display-metrics-changed', updateDisplays)

export const sendOutput = (index) => {
  const display = electron.screen.getAllDisplays()[index]

  let outputWin = window.open('', 'modal', `left=${display.bounds.x},top=${display.bounds.y}`)

  outputWin.document.write('<div style="width:100vw;height:100vh;"></div>')
  outputWin.document.body.style.margin = '0'

  setTimeout(() => {
    world.setOutput(outputWin)
  }, 1000)
}
