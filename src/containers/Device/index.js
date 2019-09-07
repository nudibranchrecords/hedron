import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import DeviceComponent from '../../components/Device'
import getConnectedDevice from '../../selectors/getConnectedDevice'

const mapStateToProps = (state, ownProps) => {
  const { title, manufacturer, lastMessage } = getConnectedDevice(state, ownProps.id)

  return {
    title,
    manufacturer,
    lastMessage,
    form: `device_${ownProps.id}`,
  }
}

const Device = reduxForm()(DeviceComponent)

export default connect(
  mapStateToProps,
)(Device)

