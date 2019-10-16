import { connect } from 'react-redux'
import PropertiesPanel from '../../components/PropertiesPanel'
import getNodeAncestors from '../../selectors/getNodeAncestors'
import { uNodeOpenInPanel } from '../../store/nodes/actions'

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
    dispatch(uNodeOpenInPanel(nodeId, ownProps.panelId))
  },
})

export default connect(
  mapStateToProps,
  mapDipatchToProps,
  null,
  {
    areStatesEqual: (next, prev) => next.nodeId === prev.nodeId,
  }
)(PropertiesPanel)
