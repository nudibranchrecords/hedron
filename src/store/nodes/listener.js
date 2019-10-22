import { uSketchNodeOpenedToggle } from '../../store/sketches/actions'
import { uiNodeToggleOpen } from '../../store/ui/actions'
import { rMacroOpenToggle } from '../../store/macros/actions'
import { nodeShotFired } from './actions'
import getNode from '../../selectors/getNode'

const handleOpenPanel = (action, store) => {
  const p = action.payload

  switch (p.panelId) {
    case 'overview':
      store.dispatch(uiNodeToggleOpen(p.nodeId))
      break
    case 'macros':
      store.dispatch(rMacroOpenToggle(p.nodeId))
      break
    case 'sketch':
    default:
      store.dispatch(uSketchNodeOpenedToggle(p.nodeId))
  }
}

const handleShotFired = (action, store) => {
  const p = action.payload
  const state = store.getState()
  const linkNode = getNode(state, p.nodeId)

  store.dispatch(nodeShotFired(p.nodeId, linkNode.sketchId, linkNode.method))
}

export default (action, store) => {
  switch (action.type) {
    case 'U_NODE_OPEN_IN_PANEL':
      handleOpenPanel(action, store)
      break
    case 'U_NODE_SHOT_FIRED':
      handleShotFired(action, store)
      break
  }
}
