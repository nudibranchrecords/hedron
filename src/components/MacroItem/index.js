import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import Param from '../../containers/Param'

const MacroItem = ({ nodeId, onAddClick, items }) => (
  <div>
    <Param nodeId={nodeId} />
    {items.map(item => (
      <Param nodeId={item.nodeId} key={item.nodeId} />
    ))}

    <Button onClick={onAddClick}>Add Target Param</Button>
  </div>
)

MacroItem.propTypes = {
  items: PropTypes.array.isRequired,
  nodeId: PropTypes.string.isRequired,
  onAddClick: PropTypes.func.isRequired
}

export default MacroItem
