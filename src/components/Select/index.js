import React from 'react'
import PropTypes from 'prop-types'

const Select = ({ options, onChange, value }) => (

  <select onChange={onChange} value={value}>
    {options.map(option =>
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )}
  </select>

)

Select.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  options: PropTypes.arrayOf(
    PropTypes.object
  ),
  onChange: PropTypes.func.isRequired,
}

export default Select
