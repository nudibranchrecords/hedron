import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import styled from 'styled-components'

const Wrapper = styled.div`

`

const Select = ({ options, onChange, title, value }) => (
  <Wrapper>
    {title}
    <ReactSelect
      clearable={false}
      searchable={false}
      value={value}
      options={options}
      onChange={onChange}
    />
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
  onChange: PropTypes.func,
  title: PropTypes.string
}

export default Select
