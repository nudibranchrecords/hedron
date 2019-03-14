import React from 'react'
import PropTypes from 'prop-types'
import InputLinkUI from '../../containers/InputLinkUI'
import Node from '../../containers/Node'

const Shot = ({ nodeId, sketchId, method }) => (
  <Node nodeId={nodeId} sketchId={sketchId} shotMethod={method} type='shot'>
    <InputLinkUI nodeId={nodeId} />
  </Node>
)

Shot.propTypes = {
  nodeId: PropTypes.string.isRequired,
  sketchId: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
}

export default Shot
