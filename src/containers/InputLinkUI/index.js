import { connect } from 'react-redux'
import InputLinkUI from '../../components/InputLinkUI'
import getNode from '../../selectors/getNode'
import getInputLinkIdsSeperated from '../../selectors/getInputLinkIdsSeperated'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const inputLinkIds = getInputLinkIdsSeperated(state, ownProps.nodeId)
  return {
    inputLinkIds,
    currentInputLinkId: node.openedLinkId,
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.nodes === prev.nodes,
  }
)(InputLinkUI)
