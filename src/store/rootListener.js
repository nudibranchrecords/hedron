import inputsListener from './inputs/listener'
import nodesListener from './nodes/listener'
import scenesListener from './scenes/listener'
import sketchesListener from './sketches/listener'
import inputLinkListener from './inputLinks/listener'
import animListener from './anims/listener'
import engineListener from '../engine/listener'
import fileWatchListener from '../fileWatch/listener'
import projectListener from './project/listener'

import { projectError } from './project/actions'

export default {
  types: 'all',

  async handleAction (action, dispatched, store) {
    try {
      inputsListener(action, store)
      nodesListener(action, store)
      scenesListener(action, store)
      sketchesListener(action, store)
      inputLinkListener(action, store)
      engineListener(action, store)
      animListener(action, store)
      fileWatchListener(action, store)
      await projectListener(action, store)
    } catch (error) {
      const state = store.getState()
      const shouldPopup = !state.nodes.areErrorPopupsDisabled.value || error.forcePopup
      console.error(error)
      store.dispatch(projectError(error.message, { popup: shouldPopup, code: error.code }))
    }
  },
}
