import { connect } from 'react-redux'
import Shot from '../../components/Shot'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.nodes[ownProps.nodeId].title,
    sketchId: state.nodes[ownProps.nodeId].sketchId,
    method: state.nodes[ownProps.nodeId].method,
    inputLinkIds: getNodeInputLinkIds(state, ownProps.nodeId)
  }
}

export default connect(
  mapStateToProps,
  null
)(Shot)
