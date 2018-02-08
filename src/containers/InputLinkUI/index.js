import { connect } from 'react-redux'
import InputLinkUI from '../../components/InputLinkUI'
import getNode from '../../selectors/getNode'
import getInputLink from '../../selectors/getInputLink'
import getInputLinkIdsSeperated from '../../selectors/getInputLinkIdsSeperated'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const activeInputLinkId = node.activeInputLinkId
  const activeInputLink = activeInputLinkId && getInputLink(state, activeInputLinkId)
  const inputLinkIds = getInputLinkIdsSeperated(state, ownProps.nodeId)
  return {
    inputLinkIds,
    inputLinkTitle: activeInputLink && activeInputLink.title,
    currentInputLinkId: node.openedLinkId
  }
}

export default connect(
  mapStateToProps
)(InputLinkUI)
