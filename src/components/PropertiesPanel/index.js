import React from 'react'
import PropTypes from 'prop-types'
import MenuPanel from '../../components/MenuPanel'
import ParamProperties from '../../containers/ParamProperties'

const PropertiesPanel = ({ title, isOpen, nodeId }) => (
  <div>
    {isOpen &&
      <MenuPanel title={title}>
        <ParamProperties nodeId={nodeId} />
      </MenuPanel>
    }
  </div>
)

PropertiesPanel.propTypes = {
  title: PropTypes.string,
  nodeId: PropTypes.string,
  isOpen: PropTypes.bool,
}

export default PropertiesPanel
