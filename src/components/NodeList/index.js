import React from 'react'
import ViewSubheader from '../ViewSubheader'
import Items from '../Items'
import Item from '../Item'
import withDeferRender from '../../utils/withDeferRender'

const NodeList = ({ nodeIds, title, component }) => {
  const Component = component
  if (nodeIds.length > 0) {
    return (
      <div>
        <ViewSubheader>{title}</ViewSubheader>
        <Items>
          {nodeIds.map((id, index) => (
            <Item key={id}>
              <Component nodeId={id} index={index} />
            </Item>
          ))}
        </Items>
      </div>
    )
  } else {
    return (null)
  }
}

export default NodeList
