import { connect } from 'react-redux'
import Param from '../../components/Param'
import getNode from '../../selectors/getNode'
import { sketchNodeOpenedToggle } from '../../store/sketches/actions'
import getIsSketchNodeOpened from '../../selectors/getIsSketchNodeOpened'
import getActiveInputsText from '../../selectors/getActiveInputsText'
import { nodeShotFired } from '../../store/nodes/actions'
import { uiEditingOpen, uiNodeToggleOpen } from '../../store/ui/actions'
import getUiIsEditingNode from '../../selectors/getUiIsEditingNode'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const inputLinkIds = node.inputLinkIds
  const param = state.nodes[ownProps.nodeId]
  const type = ownProps.type || 'param'
  const editingNode = getUiIsEditingNode(state)

  const inputLinkTitle = getActiveInputsText(state, ownProps.nodeId)

  return {
    type,
    numInputs: inputLinkIds.length,
    numMacros: node.connectedMacroIds.length,
    title: param.title,
    isOpen: getIsSketchNodeOpened(state, ownProps.sketchId, ownProps.nodeId, type, ownProps.notInSketch),
    isEditing: editingNode && editingNode.id === ownProps.nodeId,
    inputLinkTitle
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const type = ownProps.type || 'param'

  return {
    onOpenClick: () => {
      if (ownProps.notInSketch) {
        dispatch(uiNodeToggleOpen(ownProps.nodeId))
      } else {
        dispatch(sketchNodeOpenedToggle(ownProps.sketchId, ownProps.nodeId, type))
      }
    },
    onParamBarClick: type === 'shot'
    ? () => {
      dispatch(nodeShotFired(ownProps.nodeId, ownProps.sketchId, ownProps.shotMethod))
    } : undefined,
    onParamBarDoubleClick: () => {
      type === 'param' &&
      dispatch(uiEditingOpen('paramValue', ownProps.nodeId))
    }
  }
}

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Param)

export default ParamContainer
