import { connect } from 'react-redux'
import Shot from '../../components/Shot'
import getNodeModifierIds from '../../selectors/getNodeModifierIds'
import getNodeLfoOptionIds from '../../selectors/getNodeLfoOptionIds'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.nodes[ownProps.nodeId].title,
    modifierIds: getNodeModifierIds(state, ownProps.nodeId),
    lfoOptionIds: getNodeLfoOptionIds(state, ownProps.nodeId),
    sketchId: state.nodes[ownProps.nodeId].sketchId,
    method: state.nodes[ownProps.nodeId].method
  }
}

export default connect(
  mapStateToProps,
  null
)(Shot)
