import { connect } from 'react-redux'
import Select from '../../components/Select'
import { nodeValueUpdate, uNodeInputUpdate } from '../../store/nodes/actions'
import getParamInfoText from '../../selectors/getParamInfoText'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  return {
    value: select.value,
    title: select.title,
    options: select.options,
    infoText: getParamInfoText(state, ownProps.nodeId)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value.value))
    },
    onAssignClick: () => {
      dispatch(uNodeInputUpdate(ownProps.nodeId, 'midi'))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Select)
