import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import Param from '../../containers/Param'

const MacroItem = ({ nodeId, onLearningClick, items, isLearning }) => (
  <div>
    <Param nodeId={nodeId} />
    {items.map(item => (
      <Param nodeId={item.nodeId} key={item.nodeId} />
    ))}

    <Button onClick={onLearningClick}>
      {isLearning ? 'Stop Learning' : 'Start Learning'}
    </Button>
  </div>
)

MacroItem.propTypes = {
  isLearning: PropTypes.bool,
  items: PropTypes.array.isRequired,
  nodeId: PropTypes.string.isRequired,
  onLearningClick: PropTypes.func.isRequired
}

export default MacroItem
