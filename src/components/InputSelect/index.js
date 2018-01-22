import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import styled from 'styled-components'

const options = [
  {
    value: false,
    label: 'Choose',
    disabled: true
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
    type: 'midi',
    label: 'MIDI'
  },
  {
    value: 'lfo',
    label: 'LFO'
  },
  {
    value: 'beat-16',
    label: 'Beat'
  }
]

const Wrapper = styled.div`
  min-width: 5rem;
`

const InputSelect = ({ inputId, onInputChange }) => (
  <Wrapper>
    <Select clearable={false} searchable={false} options={options} onChange={onInputChange} value={inputId} />
  </Wrapper>
)

InputSelect.propTypes = {
  inputId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  onInputChange: PropTypes.func.isRequired
}

export default InputSelect
