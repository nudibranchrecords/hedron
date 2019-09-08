import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import DeviceComponent from '../../components/Device'
import getConnectedDevice from '../../selectors/getConnectedDevice'
import { deviceSettingsUpdate } from '../../store/midi/actions'

const mapStateToProps = (state, ownProps) => {
  const { title, manufacturer, lastMessage, settings, id } = getConnectedDevice(state, ownProps.id)
  return {
    id,
    title,
    manufacturer,
    lastMessage,
    form: `device_${ownProps.id}`,
    initialValues: settings,
    enableReinitialize: true,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (values) => {
    dispatch(deviceSettingsUpdate(ownProps.id, values))
  },
})

const Device = reduxForm()(DeviceComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Device)

