import { connect } from 'react-redux'
import Modifier from '../../components/Modifier'
import { uInputLinkCreate } from '../../store/inputLinks/actions'
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
    dispatch(uInputLinkCreate(ownProps.nodeId, 'midi'))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modifier)
