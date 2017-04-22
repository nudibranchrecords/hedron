import { connect } from 'react-redux'
import InputSelect from '../../components/InputSelect'
import { uParamInputUpdate } from '../../store/params/actions'
import getParamInputId from '../../selectors/getParamInputId'

const mapStateToProps = (state, ownProps) => {
  const param = state.params[ownProps.paramId]
  return {
    inputId: getParamInputId(state, ownProps.paramId),
    isLearning: state.midi.learning === ownProps.paramId,
    midiText: param.input && param.input.type === 'midi' ? param.input.info : undefined
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInputChange: (event) => {
      dispatch(uParamInputUpdate(ownProps.paramId, event.target.value))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputSelect)
