import React from 'react'
import styled from 'styled-components'
import ViewHeader from '../ViewHeader'
import { Field } from 'redux-form'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Form = styled.form`
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

const Settings = () => (
  <Wrapper>
    <ViewHeader>Settings</ViewHeader>
    <Form>
      <label htmlFor='clockGenerated'>Clock generated</label>
      <Field name='clockGenerated' component='input' type='checkbox' />
      <label htmlFor='clockBpm'>Clock generated BPM</label>
      <Field name='clockBpm' component='input' type='text' />
    </Form>
  </Wrapper>
)

export default Settings
