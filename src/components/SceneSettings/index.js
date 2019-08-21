import React from 'react'
import styled from 'styled-components'
import Input from '../Input'

const Wrapper = styled.form`
  overflow: auto;
`

const SceneSettings = () => (
  <Wrapper onSubmit={e => { e.preventDefault() }}>
    <h4>Scene Settings</h4>

    <Input name='globalPostProcessingEnabled' label='Global Post Processing' type='checkbox' layout='compact' size='small' />
  </Wrapper>
)

export default SceneSettings
