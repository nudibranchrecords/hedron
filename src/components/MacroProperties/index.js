import React from 'react'
import PropTypes from 'prop-types'
import ButtonComponent from '../Button'
import MacroLink from '../../containers/MacroLink'
import ParamProperties from '../../containers/ParamProperties'
import Row from '../Row'
import styled from 'styled-components'

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`

const Bottom = styled.div`
  margin-top: 1rem;
`

const Button = styled(ButtonComponent)`
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
    margin-left: auto;
  }
`

const MacroProperties = ({ nodeId, onLearningClick, onDeleteClick, paramLinks,
  isLearning, macroId, paramLinksAreVisible, onRenameClick }) => (
    <div>
      <ParamProperties nodeId={nodeId} />

      <Bottom>
        {
          paramLinksAreVisible &&
          <div>
            <h5>Connected Params</h5>
            <Links>
              {paramLinks.map(item => (
                <MacroLink
                  macroId={macroId}
                  nodeId={item.nodeId}
                  paramId={item.paramId}
                  key={item.nodeId}
                />
              ))}
            </Links>
          </div>
        }
      </Bottom>

      <Row>
        <Button onClick={() => { onLearningClick(macroId) }}>
          {isLearning ? 'Stop Learning' : 'Start Learning'}
        </Button>
        <Button onClick={e => {
          e.stopPropagation()
          onRenameClick(nodeId)
        }}>Rename</Button>
        <Button onClick={() => { onDeleteClick(macroId) }}>Delete Macro</Button>
      </Row>
    </div>
)

MacroProperties.propTypes = {
  isLearning: PropTypes.bool,
  paramLinks: PropTypes.array.isRequired,
  nodeId: PropTypes.string.isRequired,
  macroId: PropTypes.string.isRequired,
  onLearningClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  paramLinksAreVisible: PropTypes.bool,
  onRenameClick: PropTypes.func.isRequired,
}

export default MacroProperties
