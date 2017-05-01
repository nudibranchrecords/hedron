import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select from 'react-select'

const Info = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
`

const options = [
  {
    value: false,
    label: 'None'
  },
  {
    value: 'audio_0',
    label: 'Low'
  },
  {
    value: 'audio_1',
    label: 'Low-Mid'
  },
  {
    value: 'audio_2',
    label: 'Mid'
  },
  {
    value: 'audio_3',
    label: 'High'
  },
  {
    value: 'midi',
    label: 'MIDI'
  },
  {
    value: 'lfo',
    label: 'LFO'
  }
]

const InputSelect = ({ inputId, onInputChange, infoText }) => (
  <div>
    <Select clearable={false} searchable={false} options={options} onChange={onInputChange} value={inputId} />
    {infoText && <Info>{infoText}</Info>}
  </div>
)

InputSelect.propTypes = {
  inputId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  onInputChange: PropTypes.func.isRequired,
  infoText: PropTypes.string
}

export default InputSelect
