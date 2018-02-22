import React from 'react'
import styled from 'styled-components'
import ViewHeader from '../ViewHeader'
import Form from '../Form'
import { Field } from 'redux-form'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Settings = () => (
  <Wrapper>
    <ViewHeader>Settings</ViewHeader>
    <Form onSubmit={e => e.preventDefault()}>
      <label htmlFor='clockGenerated'>Clock generated</label>
      <Field name='clockGenerated' component='input' type='checkbox' />
      <label htmlFor='clockBpm'>Clock generated BPM</label>
      <Field name='clockBpm' component='input' type='text' />
    </Form>
  </Wrapper>
)

export default Settings
