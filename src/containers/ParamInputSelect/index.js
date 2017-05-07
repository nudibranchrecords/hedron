import { connect } from 'react-redux'
import InputSelect from '../../components/InputSelect'
import { uNodeInputUpdate } from '../../store/nodes/actions'
import getNodeInputId from '../../selectors/getNodeInputId'

const mapStateToProps = (state, ownProps) => {
  return {
    inputId: getNodeInputId(state, ownProps.nodeId)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInputChange: (value) => {
      dispatch(uNodeInputUpdate(ownProps.nodeId, value.value, value.type))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputSelect)
