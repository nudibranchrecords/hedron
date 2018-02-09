import { connect } from 'react-redux'
import ValueBar from '../../components/ValueBar'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value))
    }
  }
}

const ParamBarContainer = connect(
  null,
  mapDispatchToProps
)(ValueBar)

export default ParamBarContainer
