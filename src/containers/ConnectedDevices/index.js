import { connect } from 'react-redux'
import ConnectedDevices from '../../components/ConnectedDevices'
import getConnectedDevices from '../../selectors/getConnectedDevices'

const mapStateToProps = (state, ownProps) => ({
  items: getConnectedDevices(state),
})

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: (next, prev) => next.midi === prev.midi,
  }
)(ConnectedDevices)
