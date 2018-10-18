import { connect } from 'react-redux'
import Control from '../../components/Control'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  return {
    type: node.type || 'slider',
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
)(Control)
