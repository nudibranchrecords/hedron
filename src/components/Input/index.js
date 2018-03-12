import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'

const Wrapper = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  input[type='text'] {
    font-size: 1rem;
    display: block;
    border: 1px solid #aaa;
    background: transparent;
    color: white;
    padding: 0.2rem;
    outline: none;

    &:focus {
      border-color: white;
    }
  }

  input[type='checkbox'] {
    width: 1.2rem;
    height: 1.2rem;
  }
`

const Input = ({ name, id, label, type = 'text' }) => {
  const fieldId = id || name
  return (
    <Wrapper>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <Field name={name} id={fieldId} component='input' type={type} />
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
