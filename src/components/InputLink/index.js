import React from 'react'
import PropTypes from 'prop-types'
import Node from '../../containers/Node'
import styled from 'styled-components'
import Button from '../../components/Button'
import ButtonWithInputIcons from '../ButtonWithInputIcons'
import RowComponent from '../../components/Row'
import SequencerGrid from '../../containers/SequencerGrid'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.125rem 0.5rem -0.125rem;
`

const DeleteButton = styled(Button)`
  margin-left: auto;
`

const Item = styled.div`
  flex: ${props => props.size === 'small' ? '1' : '0 0 25%'};
  width: ${props => props.size === 'small' ? '100%' : '25%'};
  font-size: 0.8rem;
  padding: 0.125rem;
`

const Row = styled(RowComponent)`
  fill: white;
`

class InputLink extends React.Component {
  shouldComponentUpdate (prevProps) {
    return (
      this.props.isActive !== prevProps.isActive ||
      this.props.id !== prevProps.id ||
      this.props.midiOptionIds.length !== prevProps.midiOptionIds.length ||
      this.props.lfoOptionIds.length !== prevProps.lfoOptionIds.length
    )
  }

  render () {
    const { modifierIds, lfoOptionIds, size, midiOptionIds, title, toggleActionId,
      onAnimStartClick, animStartActionId, animOptionIds, audioOptionIds,
      sequencerGridId, onDeleteClick, onActivateToggle, isActive, isActivateVisible } = this.props
    return (
      <div>
        <Wrapper>
          {lfoOptionIds && lfoOptionIds.map((id) => (
            <Item key={id} size={size}>
              <Node nodeId={id} />
            </Item>
          ))}
          {modifierIds && modifierIds.map((id) => (
            <Item key={id} size={size}>
              <Node nodeId={id} />
            </Item>
          ))}
          {midiOptionIds && midiOptionIds.map((id) => (
            <Item key={id} size={size}>
              <Node nodeId={id} />
            </Item>
          ))}
          {audioOptionIds && audioOptionIds.map((id) => (
            <Item key={id} size={size}>
              <Node nodeId={id} />
            </Item>
          ))}
          {sequencerGridId &&
            <SequencerGrid nodeId={sequencerGridId} />
          }
          {animStartActionId &&
            animOptionIds.map((id) => (
              <Item key={id} size={size}>
                <Node nodeId={id} />
              </Item>
            ))
          }
        </Wrapper>
        <Row justify='space-between'>
          {isActivateVisible &&
            <ButtonWithInputIcons
              onClick={onActivateToggle}
              linkableActionId={toggleActionId}
            >
              {isActive ? 'Disable' : 'Activate'}
            </ButtonWithInputIcons>
          }
          {animStartActionId &&
            <ButtonWithInputIcons
              onClick={onAnimStartClick}
              linkableActionId={animStartActionId}
            >
              Start Anim
            </ButtonWithInputIcons>
          }

          <DeleteButton color='danger' onClick={onDeleteClick}>Delete "{title}"</DeleteButton>
        </Row>
      </div>
    )
  }
}

InputLink.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onDeleteClick: PropTypes.func.isRequired,
  onActivateToggle: PropTypes.func.isRequired,
  modifierIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  lfoOptionIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  midiOptionIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  animOptionIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  audioOptionIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  size: PropTypes.string,
  id: PropTypes.string.isRequired,
  sequencerGridId: PropTypes.string,
  toggleActionId: PropTypes.string.isRequired,
  isActivateVisible: PropTypes.bool,
  animStartActionId: PropTypes.string,
  onAnimStartClick: PropTypes.func.isRequired,
}

export default InputLink
