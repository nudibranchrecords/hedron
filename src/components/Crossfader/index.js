import React from 'react'
import styled from 'styled-components'
import Param from '../../containers/Param'
import InputLinkUI from '../../containers/InputLinkUI'

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

const Crossfader = () => (
  <Wrapper>
    <Param
      nodeId='sceneCrossfader'
      notInSketch
    >
      <InputLinkUI nodeId='sceneCrossfader' />
    </Param>
  </Wrapper>
)

export default Crossfader
