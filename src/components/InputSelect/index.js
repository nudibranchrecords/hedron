import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../containers/Select'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-width: 5rem;
`

const InputSelect = ({ onInputChange, options, nodeId }) => (
  <Wrapper>
    <Select
      id={`select-input_${nodeId}`}
      buttonText='Choose'
      options={options}
      input={{
        onChange: onInputChange,
      }}
    />
  </Wrapper>
)

InputSelect.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  nodeId: PropTypes.string.isRequired,
}

export default InputSelect
