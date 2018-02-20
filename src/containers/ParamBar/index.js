import { connect } from 'react-redux'
import ValueBar from '../../components/ValueBar'
import { nodeValueUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const type = node.type
  const linkId = node.activeInputLinkId
  const inputLink = getInputLink(state, linkId)
  const hideBar = type === 'shot' && (!inputLink || inputLink && inputLink.input.type !== 'audio')

  return {
    type,
    hideBar,
    markerIsVisible: type === 'shot' && !hideBar && inputLink.armed
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value))
    }
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValueBar)

export default ParamBarContainer
