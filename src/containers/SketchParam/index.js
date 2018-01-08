import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'
import withDeferRender from '../../utils/withDeferRender'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
   // Just using first input link to face the "active" one for now
  const activeInputLinkId = node.inputLinkIds[0]
  const activeInputLink = activeInputLinkId && getInputLink(state, activeInputLinkId)
  const inputLinkIds = node.inputLinkIds
  return {
    inputLinkIds,
    numInputs: inputLinkIds.length,
    numMacros: node.connectedMacroIds.length,
    inputLinkTitle: activeInputLink && activeInputLink.title,
    currentInputLinkId: inputLinkIds[node.openedTabIndex]
  }
}

const ParamContainer = connect(
  mapStateToProps
)(withDeferRender(SketchParam))

export default ParamContainer
