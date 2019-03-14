import { connect } from 'react-redux'
import PropertiesPanel from '../../components/PropertiesPanel'
import getNodeAncestors from '../../selectors/getNodeAncestors'

import { uSketchNodeOpenedToggle } from '../../store/sketches/actions'
import { uiNodeToggleOpen } from '../../store/ui/actions'
import { rMacroOpenToggle } from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => {
  const node = ownProps.node
  const titleItems = node ? getNodeAncestors(state, node.id).reverse() : []

  return {
    isOpen: node !== undefined,
    titleItems,
    nodeId: node && node.id,
  }
}

const mapDipatchToProps = (dispatch, ownProps) => ({
  onTitleItemClick: (nodeId) => {
    console.log(ownProps.panelId)
    switch (ownProps.panelId) {
      case 'overview':
        dispatch(uiNodeToggleOpen(nodeId))
        break
      case 'macros':
        dispatch(rMacroOpenToggle(nodeId))
        break
      case 'sketch':
      default:
        dispatch(uSketchNodeOpenedToggle(nodeId))
    }
  },
})

export default connect(
  mapStateToProps,
  mapDipatchToProps
)(PropertiesPanel)
