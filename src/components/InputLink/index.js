import React from 'react'
import PropTypes from 'prop-types'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'
import styled from 'styled-components'
import uiEventEmitter from '../../utils/uiEventEmitter'
import Button from '../../components/Button'
import Row from '../../components/Row'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`

const Item = styled.div`
  flex: ${props => props.size === 'small' ? '1' : '0 0 25%'};
  width: ${props => props.size === 'small' ? '100%' : '25%'};
  font-size: 0.8rem;
`

class InputLink extends React.Component {
  componentDidUpdate (prevProps) {
    if (this.props.id !== prevProps.id) {
      setTimeout(() => {
        uiEventEmitter.emit('repaint')
      }, 1)
    }
  }

  render () {
    const { modifierIds, lfoOptionIds, size, midiOptionIds, title, onDeleteClick, onActivateToggle, isActive } = this.props
    return (
      <div>
        <Wrapper>
          {lfoOptionIds && lfoOptionIds.map((id) => (
            <Item key={id} size={size}>
              <Select nodeId={id} />
            </Item>
          ))}
          {modifierIds && modifierIds.map((id) => (
            <Item key={id} size={size}>
              <Modifier nodeId={id} />
            </Item>
          ))}

          {midiOptionIds && midiOptionIds.map((id) => (
            <Item key={id} size={size}>
              <Modifier nodeId={id} />
            </Item>
            ))}
        </Wrapper>
        <Row justify='space-between'>
          <Button onClick={onActivateToggle}>{isActive ? 'Disable' : 'Activate'}</Button>
          <Button onClick={onDeleteClick}>Delete "{title}"</Button>
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
  id: PropTypes.string.isRequired
}

export default InputLink
