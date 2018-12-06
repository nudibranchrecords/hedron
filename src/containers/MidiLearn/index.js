import { connect } from 'react-redux'
import MidiLearn from '../../components/MidiLearn'
import { midiStopLearning } from '../../store/midi/actions'

const mapStateToProps = (state, ownProps) => ({
  isVisible: state.midi.learning !== false,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCancelClick: () => {
    dispatch(midiStopLearning())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiLearn)
