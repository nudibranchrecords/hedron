import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import styled from 'styled-components'

const Wrapper = styled.div`

`

const Select = ({ options, onChange, title, value, onAssignClick }) => (
  <Wrapper>
    {title}
    <ReactSelect
      clearable={false}
      searchable={false}
      value={value}
      options={options}
      onChange={onChange}
    />
    <a href='#' onClick={onAssignClick}>Assign MIDI</a>
  </Wrapper>
)

Select.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number
  ]),
  options: PropTypes.arrayOf(
    PropTypes.object
  ),
  onChange: PropTypes.func.isRequired,
  onAssignClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default Select
