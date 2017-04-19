import { connect } from 'react-redux'
import Param from '../../components/Param'
import { uParamInputUpdate } from '../../store/params/actions'
import { getParamInputId } from './selectors'

const mapStateToProps = (state, ownProps) => {
  const param = state.params[ownProps.paramId]
  return {
    title: param.title,
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

const ParamContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Param)

export default ParamContainer
