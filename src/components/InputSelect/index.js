import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select from 'react-select'

const Info = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
`

const Label = styled.div`
  padding: 0.25rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: #da5782;
  color: white;
`

const options = [
  {
    value: false,
    label: 'None'
  },
  {
    value: 'audio_0',
    type: 'audio',
    label: 'Low'
  },
  {
    value: 'audio_1',
    type: 'audio',
    label: 'Low-Mid'
  },
  {
    value: 'audio_2',
    type: 'audio',
    label: 'Mid'
  },
  {
    value: 'audio_3',
    type: 'audio',
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

const InputSelect = ({ inputId, onInputChange }) => (
  <div>
    <Select clearable={false} searchable={false} options={options} onChange={onInputChange} value={inputId} />
  </div>
)

InputSelect.propTypes = {
  inputId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  onInputChange: PropTypes.func.isRequired
}

export default InputSelect
