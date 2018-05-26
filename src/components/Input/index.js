import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  input[type='text'], input[type=number] {
    font-size: 1rem;
    display: block;
    border: 1px solid #aaa;
    background: ${theme.bgColorDark2};
    color: white;
    padding: 0.2rem;
    outline: none;
    width: 100%;

    &:focus {
      border-color: white;
    }
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='checkbox'] {
    width: 1.2rem;
    height: 1.2rem;
  }
`

const Input = (props) => {
  const { name, id, label, type = 'text' } = props
  const fieldId = id || name
  return (
    <Wrapper>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <Field component='input' id={fieldId} type={type} {...props} />
    </Wrapper>

  )
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired
}

export default Input
