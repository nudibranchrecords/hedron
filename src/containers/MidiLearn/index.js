import { connect } from 'react-redux'
import MidiLearn from '../../components/MidiLearn'

const mapStateToProps = (state, ownProps) => {
  return {
    isVisible: state.midi.learning !== false
  }
}

export default connect(
  mapStateToProps
)(MidiLearn)
