import { connect } from 'react-redux'
import ValueBar from './component'
import { nodeValueUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'
import getIsEditing from '../../selectors/getIsEditing'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const type = node.type
  const linkId = node.activeInputLinkId
  const inputLink = getInputLink(state, linkId)
  const hideBar = type === 'shot' && (!inputLink || inputLink && inputLink.input.type !== 'audio')

  return {
    type,
    hideBar,
    markerIsVisible: type === 'shot' && !hideBar && inputLink.armed,
    formIsVisible: getIsEditing(state, ownProps.nodeId, 'paramValue'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const valueType = ownProps.valueType

  return {
    onChange: (value) => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value))
    },
    onDoubleClick: () => {
      valueType === 'float' &&
      dispatch(uiEditingOpen('paramValue', ownProps.nodeId))
    },
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValueBar)

export default ParamBarContainer
