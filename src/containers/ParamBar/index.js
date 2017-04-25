import { connect } from 'react-redux'
import ValueBar from '../../components/ValueBar'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.nodes[ownProps.nodeId].value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value))
    }
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValueBar)

export default ParamBarContainer
