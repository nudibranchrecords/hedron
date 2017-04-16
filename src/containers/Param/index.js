import { connect } from 'react-redux'
import Param from '../../components/Param'
import { uParamInputUpdate } from '../../store/params/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.params[ownProps.paramId].title,
    inputId: state.params[ownProps.paramId].inputId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInputChange: (event) => {
      dispatch(uParamInputUpdate(ownProps.paramId, event.target.value))
    }
  }
}

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Param)

export default ParamContainer
