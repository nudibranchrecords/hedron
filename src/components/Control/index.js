import React from 'react'
import PropTypes from 'prop-types'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'

const Control = ({ nodeId, type, onChangeAction }) => {
  switch (type) {
    case 'select':
      return <Select nodeId={nodeId} onChangeAction={onChangeAction} />
    case 'slider':
      return <Modifier nodeId={nodeId} />
    default:
      return <Modifier nodeId={nodeId} />
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
