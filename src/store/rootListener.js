import scenesListener from './scenes/listener'
import sketchesListener from './sketches/listener'
import linkableActionsListener from './linkableActions/listener'
import engineListener from '../engine/listener'

export default {
  types: 'all',

  handleAction (action, dispatched, store) {
    scenesListener(action, store)
    sketchesListener(action, store)
    linkableActionsListener(action, store)
    engineListener(action, store)
  }
}
