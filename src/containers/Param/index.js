import { connect } from 'react-redux'
import Param from '../../components/Param'
import getParamInfoText from '../../selectors/getParamInfoText'
import getNodeLfoOptionIds from '../../selectors/getNodeLfoOptionIds'
import { nodeOpenToggle } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const param = state.nodes[ownProps.nodeId]
  return {
    title: param.title,
    modifierIds: param.modifierIds,
    lfoOptionIds: getNodeLfoOptionIds(state, ownProps.nodeId),
    infoText: getParamInfoText(state, ownProps.nodeId),
    isOpen: param.isOpen
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
