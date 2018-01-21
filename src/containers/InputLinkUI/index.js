import { connect } from 'react-redux'
import InputLinkUI from '../../components/InputLinkUI'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const activeInputLinkId = node.activeInputLinkId
  const activeInputLink = activeInputLinkId && getInputLink(state, activeInputLinkId)
  const inputLinkIds = node.inputLinkIds
  return {
    inputLinkIds,
    inputLinkTitle: activeInputLink && activeInputLink.title,
    currentInputLinkId: inputLinkIds[node.openedTabIndex]
  }
}

export default connect(
  mapStateToProps
)(InputLinkUI)
