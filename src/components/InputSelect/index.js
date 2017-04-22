import React from 'react'
import styled from 'styled-components'

const Info = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
`

const InputSelect = ({ inputId, onInputChange, isLearning, midiText }) => (
  <div>
    {isLearning && 'Learning...' ||
      <select onChange={onInputChange} value={inputId}>
        <option value='none'>None</option>
        <option value='audio_0'>Low</option>
        <option value='audio_1'>Low-Mid</option>
        <option value='audio_2'>Mid</option>
        <option value='audio_3'>High</option>
        <option value='midi'>MIDI</option>
      </select>
    }
    <br />
    {midiText && <Info>{midiText}</Info>}
  </div>
)

InputSelect.propTypes = {
  inputId: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  onInputChange: React.PropTypes.func.isRequired,
  isLearning: React.PropTypes.bool,
  midiText: React.PropTypes.string
}

export default InputSelect
