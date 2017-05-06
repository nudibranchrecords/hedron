import { connect } from 'react-redux'
import Modifier from '../../components/Modifier'
import { uNodeInputUpdate } from '../../store/nodes/actions'
import getParamInfoText from '../../selectors/getParamInfoText'

const mapStateToProps = (state, ownProps) => {
  const node = state.nodes[ownProps.nodeId]
  return {
    title: node.title,
    infoText: getParamInfoText(state, ownProps.nodeId)
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
