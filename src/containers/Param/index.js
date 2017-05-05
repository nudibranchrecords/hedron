import { connect } from 'react-redux'
import Param from '../../components/Param'
import getParamInfoText from '../../selectors/getParamInfoText'

const mapStateToProps = (state, ownProps) => {
  const param = state.nodes[ownProps.nodeId]
  return {
    title: param.title,
    modifierIds: param.modifierIds,
    lfoOptionIds: param.lfoOptionIds,
    infoText: getParamInfoText(state, ownProps.nodeId)
  }
}

const ParamContainer = connect(
  mapStateToProps,
  null
)(Param)

export default ParamContainer
