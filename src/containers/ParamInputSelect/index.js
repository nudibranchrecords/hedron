import { connect } from 'react-redux'
import InputSelect from '../../components/InputSelect'
import { uNodeInputUpdate } from '../../store/nodes/actions'
import getNodeInputId from '../../selectors/getNodeInputId'

const mapStateToProps = (state, ownProps) => {
  const param = state.nodes[ownProps.nodeId]
  return {
    inputId: getNodeInputId(state, ownProps.nodeId),
    isLearning: state.midi.learning === ownProps.nodeId,
    midiText: param.input && param.input.type === 'midi' ? param.input.info : undefined
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInputChange: (event) => {
      dispatch(uNodeInputUpdate(ownProps.nodeId, event.target.value))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputSelect)
