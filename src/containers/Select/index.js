import { connect } from 'react-redux'
import Select from '../../components/Select'
import { nodeValueUpdate } from '../../store/nodes/actions'

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
    onChange: (value) => {
      console.log(value)
      dispatch(nodeValueUpdate(ownProps.nodeId, value.value))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Select)
