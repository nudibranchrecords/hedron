import { EventEmitter } from 'events'

const uiEventEmitter = new EventEmitter()

uiEventEmitter.setMaxListeners(0)

window.addEventListener('resize', e => {
  e.preventDefault()
  uiEventEmitter.emit('repaint')
})

export default uiEventEmitter
