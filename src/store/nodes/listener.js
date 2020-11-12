import { uSketchNodeOpenedToggle } from '../../store/sketches/actions'
import { uiNodeToggleOpen } from '../../store/ui/actions'
import { rMacroOpenToggle } from '../../store/macros/actions'
import { nodeShotFired, rNodeDelete, rNodeInputLinkAdd, nodeTabOpen } from './actions'
import getNode from '../../selectors/getNode'
import { uInputLinkDelete } from '../inputLinks/actions'

const handleNodeDelete = (action, store) => {
  const p = action.payload
  const state = store.getState()

  const node = getNode(state, p.nodeId)

  const linkIds = node.inputLinkIds

  if (linkIds) {
    for (let i = 0; i < node.inputLinkIds.length; i++) {
      store.dispatch(uInputLinkDelete(node.inputLinkIds[i]))
    }
  }

  store.dispatch(rNodeDelete(p.nodeId))
}

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

const handleInputLinkAdd = (action, store) => {
  const p = action.payload

  store.dispatch(rNodeInputLinkAdd(p.id, p.linkId))
  store.dispatch(nodeTabOpen(p.id, p.linkId))
}

export default (action, store) => {
  switch (action.type) {
    case 'U_NODE_DELETE':
      handleNodeDelete(action, store)
      break
    case 'U_NODE_OPEN_IN_PANEL':
      handleOpenPanel(action, store)
      break
    case 'U_NODE_SHOT_FIRED':
      handleShotFired(action, store)
      break
    case 'U_NODE_INPUT_LINK_ADD':
      handleInputLinkAdd(action, store)
      break
  }
}
