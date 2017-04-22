import { connect } from 'react-redux'
import ValueBar from '../../components/ValueBar'
import { paramValueUpdate } from '../../store/params/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.params[ownProps.paramId].value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch(paramValueUpdate(ownProps.paramId, value))
    }
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(ValueBar)

export default ParamBarContainer
