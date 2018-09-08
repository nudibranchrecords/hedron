import React from 'react'
import PropTypes from 'prop-types'
import Collapsible from '../../containers/Collapsible'
import Param from '../../containers/Param'
import Range from '../../containers/Range'
import InputLinkUI from '../../containers/InputLinkUI'

const SketchParam = ({ nodeId, sketchId }) => (
  <Param nodeId={nodeId} sketchId={sketchId}>
    <Collapsible {... { title:'Advanced' }}>
      <Range nodeId={nodeId} />
    </Collapsible>
    <InputLinkUI nodeId={nodeId} />
  </Param>
)

SketchParam.propTypes = {
  nodeId: PropTypes.string.isRequired,
  sketchId: PropTypes.string.isRequired
}

export default SketchParam
