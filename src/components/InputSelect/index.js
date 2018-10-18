import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-width: 5rem;
`

const InputSelect = ({ onInputChange, options }) => (
  <Wrapper>
    <Select
      value={false}
      clearable={false}
      searchable={false}
      options={options}
      onChange={onInputChange}
    />
  </Wrapper>
)

InputSelect.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
}

export default InputSelect
