import { connect } from 'react-redux'
import Node from '../../components/Node'
import getNode from '../../selectors/getNode'
import getIsNodeOpen from '../../selectors/getIsNodeOpen'
import getActiveInputsText from '../../selectors/getActiveInputsText'
import { nodeShotFired } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const param = getNode(state, ownProps.nodeId)
  const type = ownProps.type || 'param'

  const inputLinkTitle = getActiveInputsText(state, ownProps.nodeId)

  return {
    type,
    title: param.title,
    isOpen: getIsNodeOpen(state, ownProps.nodeId, ownProps.panelId),
    inputLinkTitle,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const type = ownProps.type || 'param'

  return {
    onParamBarClick: type === 'shot'
    ? () => {
      dispatch(nodeShotFired(ownProps.nodeId, ownProps.sketchId, ownProps.shotMethod))
    } : undefined,
  }
}

const NodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Node)

export default NodeContainer
