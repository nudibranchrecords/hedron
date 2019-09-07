import { connect } from 'react-redux'
import DevicesComponent from '../../components/Devices'
import { reduxForm } from 'redux-form'

const mapStateToProps = (state, ownProps) => ({
  items: Object.keys(state.midi.devices).map(key => state.midi.devices[key]),
})

const Devices = reduxForm({
  form: 'devices',
})(DevicesComponent)

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: (next, prev) => next.midi === prev.midi,
  }
)(Devices)
