import { connect } from 'react-redux'
import ParamBar from '../../components/ParamBar'
import { paramUpdate } from './actions'

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.params[ownProps.paramId].value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (event) => {
      dispatch(paramUpdate(ownProps.paramId, parseFloat(event.target.value)))
    }
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParamBar)

export default ParamBarContainer
