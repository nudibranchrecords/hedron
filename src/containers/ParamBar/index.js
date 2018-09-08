import { connect } from 'react-redux'
import ValueBar from '../../components/ValueBar'
import { nodeValueUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'
import getUiIsEditingNode from '../../selectors/getUiIsEditingNode'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const type = node.type
  const linkId = node.activeInputLinkId
  const inputLink = getInputLink(state, linkId)
  const hideBar = type === 'shot' && (!inputLink || inputLink && inputLink.input.type !== 'audio')
  const editingNode = getUiIsEditingNode(state)

  return {
    type,
    hideBar,
    markerIsVisible: type === 'shot' && !hideBar && inputLink.armed,
    formIsVisible: editingNode && editingNode.id === ownProps.nodeId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const type = ownProps.type || 'param'

  return {
    onChange: (value) => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value))
    },
    onDoubleClick: () => {
      type === 'param' &&
      dispatch(uiEditingOpen('paramValue', ownProps.nodeId))
    }
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValueBar)

export default ParamBarContainer
