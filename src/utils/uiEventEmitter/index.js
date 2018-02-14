import { EventEmitter } from 'events'

const uiEventEmitter = new EventEmitter()

uiEventEmitter.setMaxListeners(0)

window.addEventListener('resize', e => {
  e.preventDefault()
  uiEventEmitter.emit('repaint')
})

window.setInterval(() => {
  uiEventEmitter.emit('slow-tick')
}, 32)

export default uiEventEmitter
