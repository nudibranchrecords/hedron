import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import Param from '../../containers/Param'
import MacroLink from '../../containers/MacroLink'
import Row from '../Row'

const MacroItem = ({ nodeId, onLearningClick, items, isLearning, macroId }) => (
  <div>
    <Param nodeId={nodeId}>
      <Row>
        {items.map(item => (
          <MacroLink
            macroId={macroId}
            nodeId={item.nodeId}
            paramId={item.paramId}
            key={item.nodeId}
          />
        ))}
      </Row>
    </Param>

    <Button onClick={onLearningClick}>
      {isLearning ? 'Stop Learning' : 'Start Learning'}
    </Button>
  </div>
)

MacroItem.propTypes = {
  isLearning: PropTypes.bool,
  items: PropTypes.array.isRequired,
  nodeId: PropTypes.string.isRequired,
  macroId: PropTypes.string.isRequired,
  onLearningClick: PropTypes.func.isRequired
}

export default MacroItem
