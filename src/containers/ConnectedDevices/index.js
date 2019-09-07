import { connect } from 'react-redux'
import ConnectedDevices from '../../components/ConnectedDevices'

const mapStateToProps = (state, ownProps) => ({
  items: Object.keys(state.midi.devices).map(key => state.midi.devices[key]),
})

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: (next, prev) => next.midi === prev.midi,
  }
)(ConnectedDevices)
