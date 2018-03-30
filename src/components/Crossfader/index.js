import React from 'react'
import styled from 'styled-components'
import Control from '../../containers/Control'

const Wrapper = styled.div`
  margin-bottom: 1rem;
`
const Crossfader = () => (
  <Wrapper>
    <Control
      nodeId='sceneCrossfader'
    />
  </Wrapper>
)

export default Crossfader
