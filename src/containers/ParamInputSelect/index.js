import { connect } from 'react-redux'
import InputSelect from '../../components/InputSelect'
import { uNodeInputUpdate } from '../../store/nodes/actions'
import getNodeInputId from '../../selectors/getNodeInputId'
import { getInfoText } from './selectors'

const mapStateToProps = (state, ownProps) => {
  return {
    inputId: getNodeInputId(state, ownProps.nodeId),
    isLearning: state.midi.learning === ownProps.nodeId,
    infoText: getInfoText(state, ownProps.nodeId)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInputChange: (value) => {
      dispatch(uNodeInputUpdate(ownProps.nodeId, value.value))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputSelect)
