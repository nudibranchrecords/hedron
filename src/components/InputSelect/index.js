import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-width: 5rem;
`

const InputSelect = ({ inputId, onInputChange, options }) => (
  <Wrapper>
    <Select clearable={false} searchable={false} options={options} onChange={onInputChange} value={inputId} />
  </Wrapper>
)

InputSelect.propTypes = {
  inputId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  onInputChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
}

export default InputSelect
