import React from 'react'
import PropTypes from 'prop-types'
import MenuPanel from '../../components/MenuPanel'

const PropertiesPanel = ({ title, isOpen, nodeId, Component, onCloseClick }) => (
  <div>
    {isOpen &&
      <MenuPanel title={title} onCloseClick={onCloseClick}>
        <Component nodeId={nodeId} />
      </MenuPanel>
    }
  </div>
)

PropertiesPanel.propTypes = {
  title: PropTypes.string,
  nodeId: PropTypes.string,
  isOpen: PropTypes.bool,
  Component: PropTypes.func,
  onCloseClick: PropTypes.func,
}

export default PropertiesPanel
