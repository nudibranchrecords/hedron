import { connect } from 'react-redux'
import ParamCheckbox from './component'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: (value) => {
    dispatch(nodeValueUpdate(ownProps.nodeId, value))
  },
})

const ParamCheckboxContainer = connect(
  null,
  mapDispatchToProps
)(ParamCheckbox)

export default ParamCheckboxContainer
