import React from 'react'
import PropTypes from 'prop-types'
import Control from '../../containers/Control'
import styled from 'styled-components'
import uiEventEmitter from '../../utils/uiEventEmitter'
import Button from '../../components/Button'
import Row from '../../components/Row'
import InputLinkMidiControl from '../../containers/InputLinkMidiControl'
import SequencerGrid from '../../containers/SequencerGrid'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`

const ActivateButton = styled(Button)`
  margin-right: 0.25rem;
`

const DeleteButton = styled(Button)`
  margin-left: auto;
`

const Item = styled.div`
  flex: ${props => props.size === 'small' ? '1' : '0 0 25%'};
  width: ${props => props.size === 'small' ? '100%' : '25%'};
  font-size: 0.8rem;
`

class InputLink extends React.Component {
  componentDidMount () {
    uiEventEmitter.emit('repaint')
  }

  componentDidUpdate (prevProps) {
    if (this.props.id !== prevProps.id) {
      setTimeout(() => {
        uiEventEmitter.emit('repaint')
      }, 1)
    }
  }

  shouldComponentUpdate (prevProps) {
    return (
      this.props.isActive !== prevProps.isActive ||
      this.props.id !== prevProps.id ||
      this.props.midiOptionIds.length !== prevProps.midiOptionIds.length
    )
  }

  render () {
    const { modifierIds, lfoOptionIds, size, midiOptionIds, title, toggleActionId,
      sequencerGridId, onDeleteClick, onActivateToggle, isActive, isActivateVisible } = this.props
    return (
      <div>
        <Wrapper>
          {lfoOptionIds && lfoOptionIds.map((id) => (
            <Item key={id} size={size}>
              <Control nodeId={id} />
            </Item>
          ))}
          {modifierIds && modifierIds.map((id) => (
            <Item key={id} size={size}>
              <Control nodeId={id} />
            </Item>
          ))}
          {midiOptionIds && midiOptionIds.map((id) => (
            <Item key={id} size={size}>
              <Control nodeId={id} />
            </Item>
          ))}
          {sequencerGridId &&
            <SequencerGrid nodeId={sequencerGridId} />
          }
        </Wrapper>
        <Row justify='space-between'>
          {isActivateVisible &&
            <Row>
              <ActivateButton onClick={onActivateToggle}>{isActive ? 'Disable' : 'Activate'}</ActivateButton>
              <InputLinkMidiControl linkableActionId={toggleActionId} />
            </Row>
          }

          <DeleteButton onClick={onDeleteClick}>Delete "{title}"</DeleteButton>
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
  size: PropTypes.string,
  id: PropTypes.string.isRequired,
  sequencerGridId: PropTypes.string,
  toggleActionId: PropTypes.string.isRequired,
  isActivateVisible: PropTypes.bool,
}

export default InputLink
