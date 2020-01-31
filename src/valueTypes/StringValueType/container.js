import { connect } from 'react-redux'
import ParamString from './component'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (value) => {
    dispatch(nodeValueUpdate(ownProps.nodeId, value))
  },
})

const ParamStringContainer = connect(
  null,
  mapDispatchToProps
)(ParamString)

export default ParamStringContainer
