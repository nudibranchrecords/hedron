import React from 'react'
import styled from 'styled-components'
import Input from '../Input'

const Wrapper = styled.form`
  overflow: auto;
  padding-bottom: 0.5rem;
`

const SceneSettings = () => (
  <Wrapper onSubmit={e => { e.preventDefault() }}>
    <h4>Scene Settings</h4>

    <Input
      name='globalPostProcessingEnabled'
      label='Global Post Processing'
      type='checkbox'
      layout='compact'
    />
  </Wrapper>
)

export default SceneSettings
