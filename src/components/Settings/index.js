import React from 'react'
import styled from 'styled-components'
import ViewHeader from '../ViewHeader'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Settings = () => (
  <Wrapper>
    <ViewHeader>Settings</ViewHeader>
  </Wrapper>
)

export default Settings
