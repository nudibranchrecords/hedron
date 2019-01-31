import React from 'react'
import PropTypes from 'prop-types'
import MenuPanel from '../../components/MenuPanel'

const PropertiesPanel = ({ title, isOpen, nodeId, Component }) => (
  <div>
    {isOpen &&
      <MenuPanel title={title}>
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
}

export default PropertiesPanel
