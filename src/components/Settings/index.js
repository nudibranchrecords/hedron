import React from 'react'
import styled from 'styled-components'
import ViewHeader from '../ViewHeader'
import Input from '../Input'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Settings = () => (
  <Wrapper>
    <ViewHeader>Settings</ViewHeader>
    <form onSubmit={e => e.preventDefault()}>
      <Input name='clockGenerated' label='Clock Generated' type='checkbox' />
      <Input name='clockBpm' label='Clock BPM' />
    </form>
  </Wrapper>
)

export default Settings
