import nodesListener from './nodes/listener'
import scenesListener from './scenes/listener'
import sketchesListener from './sketches/listener'
import inputLinkListener from './inputLinks/listener'
import animListener from './anims/listener'
import engineListener from '../engine/listener'
import fileWatchListener from '../fileWatch/listener'
import { listener as audioAnalyzerListener } from '../inputs/AudioAnalyzer'

export default {
  types: 'all',

  handleAction(action, dispatched, store) {
    nodesListener(action, store)
    scenesListener(action, store)
    sketchesListener(action, store)
    inputLinkListener(action, store)
    engineListener(action, store)
    animListener(action, store)
    fileWatchListener(action, store)
    audioAnalyzerListener(action, store)
  },
}
