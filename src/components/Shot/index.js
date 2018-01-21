import React from 'react'
import PropTypes from 'prop-types'
import InputLinkUI from '../../containers/InputLinkUI'
import Param from '../../containers/Param'

const Shot = ({ nodeId, sketchId }) => (
  <Param nodeId={nodeId} sketchId={sketchId} type='shot'>
    <InputLinkUI nodeId={nodeId} />
  </Param>
)

Shot.propTypes = {
  nodeId: PropTypes.string.isRequired,
  sketchId: PropTypes.string
}

export default Shot
