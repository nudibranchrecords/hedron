import inputsListener from './inputs/listener'
import nodesListener from './nodes/listener'
import scenesListener from './scenes/listener'
import sketchesListener from './sketches/listener'
import inputLinkListener from './inputLinks/listener'
import animListener from './anims/listener'
import engineListener from '../engine/listener'
import fileWatchListener from '../fileWatch/listener'

export default {
  types: 'all',

  handleAction (action, dispatched, store) {
    inputsListener(action, store)
    nodesListener(action, store)
    scenesListener(action, store)
    sketchesListener(action, store)
    inputLinkListener(action, store)
    animListener(action, store)
    engineListener(action, store)
    fileWatchListener(action, store) // Should always be last
  },
}
