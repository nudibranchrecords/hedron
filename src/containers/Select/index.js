import { connect } from 'react-redux'
import Select from '../../components/Select'
import { nodeValueUpdate, uNodeInputUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  return {
    value: select.value,
    title: select.title,
    options: select.options
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
