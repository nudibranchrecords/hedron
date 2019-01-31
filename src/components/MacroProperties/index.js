import React from 'react'
import PropTypes from 'prop-types'

import ParamProperties from '../../containers/ParamProperties'

const MacroProperties = ({ nodeId }) => (
  <div>
    <ParamProperties nodeId={nodeId} />
  </div>
)

MacroProperties.propTypes = {
  nodeId: PropTypes.string.isRequired,
}

export default MacroProperties
