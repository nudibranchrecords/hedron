import React from 'react'
import PropTypes from 'prop-types'
import MidiButton from '../../components/MidiButton'

const InputLinkMidiControl = ({ onAssignClick }) => (
  <div>
    <MidiButton onClick={onAssignClick} />
  </div>
)

InputLinkMidiControl.propTypes = {
  onAssignClick: PropTypes.func.isRequired
}

export default InputLinkMidiControl
