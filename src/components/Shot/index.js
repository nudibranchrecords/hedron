import React from 'react'
import PropTypes from 'prop-types'
import InputLinkUI from '../../containers/InputLinkUI'
import Param from '../../containers/Param'

const Shot = ({ nodeId, sketchId, method }) => (
  <Param nodeId={nodeId} sketchId={sketchId} shotMethod={method} type='shot'>
    <InputLinkUI nodeId={nodeId} />
  </Param>
)

Shot.propTypes = {
  nodeId: PropTypes.string.isRequired,
  sketchId: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
}

export default Shot
