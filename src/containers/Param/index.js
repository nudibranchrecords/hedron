import { connect } from 'react-redux'
import Param from '../../components/Param'
import { inputAssignedParamAdd } from '../../store/inputs/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.params[ownProps.paramId].title
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onIncomingInputChange: (event) => {
      dispatch(inputAssignedParamAdd(event.target.value, ownProps.paramId))
    }
  }
}

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Param)

export default ParamContainer
