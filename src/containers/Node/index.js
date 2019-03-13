import { connect } from 'react-redux'
import Node from '../../components/Node'
import getNode from '../../selectors/getNode'
import { uSketchNodeOpenedToggle } from '../../store/sketches/actions'
import getIsNodeOpen from '../../selectors/getIsNodeOpen'
import getActiveInputsText from '../../selectors/getActiveInputsText'
import { nodeShotFired } from '../../store/nodes/actions'
import { uiNodeToggleOpen } from '../../store/ui/actions'
import { rMacroOpenToggle } from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const inputLinkIds = node.inputLinkIds
  const param = state.nodes[ownProps.nodeId]
  const type = ownProps.type || 'param'

  const inputLinkTitle = getActiveInputsText(state, ownProps.nodeId)

  return {
    type,
    numInputs: inputLinkIds.length,
    numMacros: node.connectedMacroIds.length,
    title: param.title,
    isOpen: getIsNodeOpen(state, ownProps.nodeId, ownProps.panelId),
    inputLinkTitle,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const type = ownProps.type || 'param'

  return {
    onOpenClick: (panelId = ownProps.panelId) => {
      switch (panelId) {
        case 'overview':
          dispatch(uiNodeToggleOpen(ownProps.nodeId))
          break
        case 'macros':
          dispatch(rMacroOpenToggle(ownProps.nodeId))
          break
        case 'sketch':
        default:
          dispatch(uSketchNodeOpenedToggle(ownProps.nodeId))
      }
    },
    onParamBarClick: type === 'shot'
    ? () => {
      dispatch(nodeShotFired(ownProps.nodeId, ownProps.sketchId, ownProps.shotMethod))
    } : undefined,
  }
}

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Node)

export default ParamContainer
