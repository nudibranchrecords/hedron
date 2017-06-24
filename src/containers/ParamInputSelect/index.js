import { connect } from 'react-redux'
import InputSelect from '../../components/InputSelect'
import { uInputLinkCreate } from '../../store/inputLinks/actions'
import getNodeInputId from '../../selectors/getNodeInputId'

const mapStateToProps = (state, ownProps) => {
  return {
    inputId: getNodeInputId(state, ownProps.nodeId)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInputChange: (value) => {
      dispatch(uInputLinkCreate(ownProps.nodeId, value.value, value.type))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputSelect)
