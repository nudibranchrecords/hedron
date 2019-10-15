import { connect } from 'react-redux'
import ParamCheckbox from '../../components/ParamCheckbox'
import { nodeValueUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  return {
    value: node.value,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: (value) => {
    dispatch(nodeValueUpdate(ownProps.nodeId, value))
  },
})

const ParamCheckboxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParamCheckbox)

export default ParamCheckboxContainer
