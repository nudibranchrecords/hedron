import React from 'react'
import PropTypes from 'prop-types'
import ViewSubheader from '../ViewSubheader'
import Items from '../Items'
import Item from '../Item'

const NodeList = ({ nodeIds, title, component, type }) => {
  const Component = component
  if (nodeIds.length > 0) {
    return (
      <div>
        <ViewSubheader>{title}</ViewSubheader>
        <Items>
          {nodeIds.map((id, index) => (
            <Item key={id}>
              <Component nodeId={id} index={index} type={type} />
            </Item>
          ))}
        </Items>
      </div>
    )
  } else {
    return (null)
  }
}

NodeList.propTypes = {
  title: PropTypes.string.isRequired,
  nodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  component: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

export default NodeList
