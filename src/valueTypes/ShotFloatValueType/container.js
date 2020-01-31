import { connect } from 'react-redux'
import ValueBar from '../FloatValueType/component'
import { nodeValueUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'

// It's worth noting that this container shares a component with FloatValueType!

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const type = node.type
  const linkId = node.activeInputLinkId
  const inputLink = getInputLink(state, linkId)
  const hideBar = !inputLink || inputLink && inputLink.input.type !== 'audio'

  return {
    type,
    hideBar,
    markerIsVisible: !hideBar && inputLink.armed,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value))
    },
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValueBar)

export default ParamBarContainer
