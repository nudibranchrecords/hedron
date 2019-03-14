import { uSketchNodeOpenedToggle } from '../../store/sketches/actions'
import { uiNodeToggleOpen } from '../../store/ui/actions'
import { rMacroOpenToggle } from '../../store/macros/actions'

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

export default (action, store) => {
  switch (action.type) {
    case 'U_NODE_OPEN_IN_PANEL':
      handleOpenPanel(action, store)
      break
  }
}
