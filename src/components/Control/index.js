import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import NodeSelect from '../../containers/NodeSelect'

const Control = ({ nodeId, onParamBarClick, type, theme, onChangeAction }) => {
  switch (type) {
    case 'select':
      return <NodeSelect nodeId={nodeId} onChangeAction={onChangeAction} />
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
  onChangeAction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    payload: PropTypes.object,
  }),
  type: PropTypes.string,
  theme: PropTypes.string,
}

export default Control
