import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'
import withDeferRender from '../../utils/withDeferRender'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const activeInputLinkId = node.activeInputLinkId
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
