import React from 'react'
import PropTypes from 'prop-types'
import MenuPanel from '../../components/MenuPanel'
import { PanelContext } from '../../context'

const PropertiesPanel = ({ title, isOpen, nodeId, Component, onCloseClick, panelId }) => (
  <PanelContext.Provider value={panelId}>
    {isOpen &&
      <MenuPanel title={title} onCloseClick={onCloseClick}>
        <Component nodeId={nodeId} />
      </MenuPanel>
    }
  </PanelContext.Provider>
)

PropertiesPanel.propTypes = {
  title: PropTypes.string,
  nodeId: PropTypes.string,
  isOpen: PropTypes.bool,
  Component: PropTypes.func,
  onCloseClick: PropTypes.func,
  panelId: PropTypes.string,
}

export default PropertiesPanel
