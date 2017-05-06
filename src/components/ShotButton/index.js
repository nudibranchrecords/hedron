import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'

const ShotButton = ({ onClick, nodeId }) => (
  <ParamBar nodeId={nodeId} onClick={onClick} />
)

ShotButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  nodeId: PropTypes.string.isRequired
}

export default ShotButton
