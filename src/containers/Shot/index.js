import { connect } from 'react-redux'
import Shot from '../../components/Shot'
import getNodeModifierIds from '../../selectors/getNodeModifierIds'
import getNodeLfoOptionIds from '../../selectors/getNodeLfoOptionIds'
import getParamInfoText from '../../selectors/getParamInfoText'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.nodes[ownProps.nodeId].title,
    modifierIds: getNodeModifierIds(state, ownProps.nodeId),
    lfoOptionIds: getNodeLfoOptionIds(state, ownProps.nodeId),
    sketchId: state.nodes[ownProps.nodeId].sketchId,
    infoText: getParamInfoText(state, ownProps.nodeId),
    method: state.nodes[ownProps.nodeId].method
  }
}

export default connect(
  mapStateToProps,
  null
)(Shot)
