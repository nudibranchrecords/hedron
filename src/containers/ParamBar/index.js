import { connect } from 'react-redux'
import ParamBar from '../../components/ParamBar'
import { sketchesParamValueUpdate } from '../../store/sketches/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.sketches.params[ownProps.paramId].value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (event) => {
      dispatch(sketchesParamValueUpdate(ownProps.paramId, parseFloat(event.target.value)))
    }
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParamBar)

export default ParamBarContainer
