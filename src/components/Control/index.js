import React from 'react'
import PropTypes from 'prop-types'

const Control = ({ nodeId, onParamBarClick, Component, theme, onChangeAction, valueType }) =>
  <Component
    nodeId={nodeId}
    onMouseDown={onParamBarClick}
    onChangeAction={onChangeAction}
    theme={theme}
    valueType={valueType}
  />

Control.propTypes = {
  nodeId: PropTypes.string.isRequired,
  onParamBarClick: PropTypes.func,
  onChangeAction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    payload: PropTypes.object,
  }),
  Component: PropTypes.elementType.isRequired,
  theme: PropTypes.string,
  valueType: PropTypes.string,
}

export default Control
