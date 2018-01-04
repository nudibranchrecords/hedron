import { EventEmitter } from 'events'

const uiEventEmitter = new EventEmitter()

window.addEventListener('resize', e => {
  e.preventDefault()
  uiEventEmitter.emit('repaint')
})

export default uiEventEmitter
