import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import NodeSelect from '../../containers/NodeSelect'

const Control = ({ nodeId, onParamBarClick, type, theme }) => {
  switch (type) {
    case 'select':
      return <NodeSelect nodeId={nodeId} />
    case 'slider':
    default:
      return <ParamBar
        nodeId={nodeId}
        onMouseDown={onParamBarClick}
        type={type}
        theme={theme}
            />
  }
}

Control.propTypes = {
  nodeId: PropTypes.string.isRequired,
  onParamBarClick: PropTypes.func,
  type: PropTypes.string,
  theme: PropTypes.string,
}

export default Control
