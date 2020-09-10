import React from 'react'
import Device from '../../containers/Device'
import PropTypes from 'prop-types'

const ConnectedDevices = ({ items }) => (
  <div>
    <h6>Connected Devices</h6>
    <ul>
      {items.map(item => {
        return (
          <li key={item.id}>
            <Device id={item.id} />
          </li>
        )
      })}
    </ul>
  </div>
)

ConnectedDevices.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
}

export default ConnectedDevices
