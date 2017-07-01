import { connect } from 'react-redux'
import Param from '../../components/Param'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'
import { nodeOpenToggle } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const param = state.nodes[ownProps.nodeId]
  return {
    title: param.title,
    inputLinkIds: getNodeInputLinkIds(state, ownProps.nodeId),
    isOpen: param.isOpen,
    isLearningMidi: state.midi.learning === ownProps.nodeId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onOpenClick: () => { dispatch(nodeOpenToggle(ownProps.nodeId)) }
})

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Param)

export default ParamContainer
