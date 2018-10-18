import React from 'react'
import PropTypes from 'prop-types'
import OverlayModal from '../OverlayModal'

const MidiLearn = ({ isVisible, onCancelClick }) => (
  <OverlayModal
    isVisible={isVisible}
    title='Learning Midi'
    onCancelClick={onCancelClick}
  >
    <p>Use a MIDI control to teach (press a button or twiddle a knob!)</p>
  </OverlayModal>
)

export default MidiLearn

MidiLearn.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired,
}
