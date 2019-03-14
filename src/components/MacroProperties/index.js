import React from 'react'
import PropTypes from 'prop-types'
import ButtonComponent from '../Button'
import MacroLink from '../../containers/MacroLink'
import Row from '../Row'
import styled from 'styled-components'

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`

const Bottom = styled.div`
  margin-top: auto;
  padding-top: 1rem;
`

const Button = styled(ButtonComponent)`
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
    margin-left: auto;
  }
`

const MacroProperties = ({ macroId, onLearningClick, onDeleteClick, paramLinks,
  isLearning, paramLinksAreVisible, onRenameClick }) => (
    <Wrapper>
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
        <Button onClick={onRenameClick}>Rename</Button>
        <Button color='danger' onClick={onDeleteClick}>Delete Macro</Button>
      </Row>
    </Wrapper>
)

MacroProperties.propTypes = {
  isLearning: PropTypes.bool,
  paramLinks: PropTypes.array.isRequired,
  macroId: PropTypes.string.isRequired,
  onLearningClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  paramLinksAreVisible: PropTypes.bool,
  onRenameClick: PropTypes.func.isRequired,
}

export default MacroProperties
