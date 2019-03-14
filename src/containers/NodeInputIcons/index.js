import { connect } from 'react-redux'
import NodeInputIcons from '../../components/NodeInputIcons'
import getNode from '../../selectors/getNode'
import { uSketchNodeOpenedToggle } from '../../store/sketches/actions'
import getActiveInputsText from '../../selectors/getActiveInputsText'
import { uiNodeToggleOpen } from '../../store/ui/actions'
import { rMacroOpenToggle } from '../../store/macros/actions'
import { uNodeOpenInPanel } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const inputLinkIds = node.inputLinkIds

  const inputLinkTitle = getActiveInputsText(state, ownProps.nodeId)

  return {
    numInputs: inputLinkIds.length,
    numMacros: node.connectedMacroIds.length,
    inputLinkTitle,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: (panelId = ownProps.panelId) => {
    dispatch(uNodeOpenInPanel(ownProps.nodeId, panelId))
  },
})

const NodeInputIconsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeInputIcons)

export default NodeInputIconsContainer
