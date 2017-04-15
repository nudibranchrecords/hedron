import { connect } from 'react-redux'
import ParamBar from '../../components/ParamBar'
import { paramValueUpdate } from '../../store/params/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.params[ownProps.paramId].value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (event) => {
      dispatch(paramValueUpdate(ownProps.paramId, parseFloat(event.target.value)))
    }
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(ParamBar)

export default ParamBarContainer
