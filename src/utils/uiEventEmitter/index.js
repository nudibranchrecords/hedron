import EventEmitter from 'eventemitter3'

const uiEventEmitter = new EventEmitter()

window.addEventListener('resize', e => {
  e.preventDefault()
  uiEventEmitter.emit('repaint')
})

window.setInterval(() => {
  uiEventEmitter.emit('slow-tick')
}, 32)

export default uiEventEmitter
