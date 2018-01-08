import React from 'react'
import PropTypes from 'prop-types'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'
import styled from 'styled-components'
import uiEventEmitter from '../../utils/uiEventEmitter'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
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
    const { modifierIds, lfoOptionIds, size, midiOptionIds } = this.props
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
      </div>
    )
  }
}

InputLink.propTypes = {
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
