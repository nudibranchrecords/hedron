import React from 'react'
import PropTypes from 'prop-types'
import Node from '../../containers/Node'
import Select from '../../containers/Select'

const Control = ({ type, ...props }) => {
  switch (type) {
    case 'select':
      return <Select {...props} />
    case 'slider':
    default:
      return <Node {...props} />
  }
}

Control.propTypes = {
  nodeId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChangeAction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    payload: PropTypes.object,
  }),
}

export default Control
