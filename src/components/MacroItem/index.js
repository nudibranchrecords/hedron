import React from 'react'
import PropTypes from 'prop-types'
import ButtonComponent from '../Button'
import Param from '../../components/Param'
import MacroLink from '../../containers/MacroLink'
import InputLinkUI from '../../containers/InputLinkUI'
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

const MacroItem = ({
  nodeId, onLearningClick, onDeleteClick, paramLinks, inputLinkIds, isLearning,
  macroId, inputSettingsAreVisible, paramLinksAreVisible, isOpen, title, onOpenClick, numInputs,
  inputLinkTitle, onRenameClick
}) => (
  <div>
    <Param
      isOpen={isOpen}
      isActive={isLearning}
      title={title}
      onOpenClick={onOpenClick}
      nodeId={nodeId}
      numInputs={numInputs}
      inputLinkTitle={inputLinkTitle}
    >
      <InputLinkUI nodeId={nodeId} />

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
        <Button onClick={onLearningClick}>
          {isLearning ? 'Stop Learning' : 'Start Learning'}
        </Button>
        <Button onClick={() => { onRenameClick(nodeId) }}>Rename</Button>
        <Button onClick={onDeleteClick}>Delete Macro</Button>
      </Row>
    </Param>

  </div>
)

MacroItem.propTypes = {
  isLearning: PropTypes.bool,
  paramLinks: PropTypes.array.isRequired,
  inputLinkIds: PropTypes.array.isRequired,
  nodeId: PropTypes.string.isRequired,
  macroId: PropTypes.string.isRequired,
  onLearningClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  inputSettingsAreVisible: PropTypes.bool,
  paramLinksAreVisible: PropTypes.bool,
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onOpenClick: PropTypes.func.isRequired,
  numInputs: PropTypes.number.isRequired,
  inputLinkTitle: PropTypes.string,
  onRenameClick: PropTypes.func.isRequired
}

export default MacroItem
