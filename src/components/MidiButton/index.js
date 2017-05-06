import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from '../Icon'
import midiIcon from '../../assets/icons/midi.svg'

const Button = styled(Icon)`
  cursor: pointer;

  &:hover {
    fill: #DA5782
  }
`

const MidiButton = ({ onClick }) => (
  <Button glyph={midiIcon} onClick={onClick} />
)

MidiButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default MidiButton
