import { connect } from 'react-redux'
import Modifier from '../../components/Modifier'
import { uNodeInputUpdate } from '../../store/nodes/actions'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'

const mapStateToProps = (state, ownProps) => {
  const node = state.nodes[ownProps.nodeId]
  return {
    title: node.title,
    inputLinkIds: getNodeInputLinkIds(state, ownProps.nodeId),
    isLearningMidi: state.midi.learning === ownProps.nodeId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignClick: () => {
    dispatch(uNodeInputUpdate(ownProps.nodeId, 'midi'))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modifier)
