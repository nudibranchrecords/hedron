import world from './Engine/world.js'

const win = nw.Window.get()

win.on('resize', function () {
  world.setSize()
})
