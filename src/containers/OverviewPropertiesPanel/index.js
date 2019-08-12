import { connect } from 'react-redux'
import PropertiesPanel from '../../containers/PropertiesPanel'
import NodeProperties from '../NodeProperties'
import getUiOpenedNodeId from '../../selectors/getUiOpenedNodeId'
import getNode from '../../selectors/getNode'
import { uiNodeClose } from '../../store/ui/actions'

const mapStateToProps = (state) => {
  const nodeId = getUiOpenedNodeId(state)
  const node = getNode(state, nodeId)
  return {
    Component: NodeProperties,
    node: node,
    panelId: 'overview',
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseClick: () => {
      dispatch(uiNodeClose())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesPanel)
