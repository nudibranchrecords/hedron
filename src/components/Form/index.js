import styled from 'styled-components'

export default styled.form`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  input {
    margin-bottom: 1rem;
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
