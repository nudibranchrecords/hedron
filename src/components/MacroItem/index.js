import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import Param from '../../containers/Param'
import MacroLink from '../../containers/MacroLink'
import Row from '../Row'
import styled from 'styled-components'

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`

const MacroItem = ({ nodeId, onLearningClick, onDeleteClick, items, isLearning, macroId }) => (
  <div>
    <Param nodeId={nodeId}>
      <Links>
        {items.map(item => (
          <MacroLink
            macroId={macroId}
            nodeId={item.nodeId}
            paramId={item.paramId}
            key={item.nodeId}
          />
        ))}
      </Links>
      <Row justify='space-between'>
        <Button onClick={onLearningClick}>
          {isLearning ? 'Stop Learning' : 'Start Learning'}
        </Button>
        <Button onClick={onDeleteClick}>Delete Macro</Button>
      </Row>
    </Param>

  </div>
)

MacroItem.propTypes = {
  isLearning: PropTypes.bool,
  items: PropTypes.array.isRequired,
  nodeId: PropTypes.string.isRequired,
  macroId: PropTypes.string.isRequired,
  onLearningClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
}

export default MacroItem
