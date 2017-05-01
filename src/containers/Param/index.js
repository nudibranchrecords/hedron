import { connect } from 'react-redux'
import Param from '../../components/Param'

const mapStateToProps = (state, ownProps) => {
  const param = state.nodes[ownProps.nodeId]
  return {
    title: param.title,
    modifierIds: param.modifierIds,
    lfoOptionIds: param.lfoOptionIds
  }
}

const ParamContainer = connect(
  mapStateToProps,
  null
)(Param)

export default ParamContainer
