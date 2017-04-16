import React from 'react'
import styled from 'styled-components'

import ShotButton from '../../containers/ShotButton'

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
`

const Shot = ({ title, method, sketchId }) => (
  <Wrapper>
    {title}
    <br />
    <ShotButton sketchId={sketchId} method={method} />
  </Wrapper>
)

Shot.propTypes = {
  title: React.PropTypes.string.isRequired,
  method: React.PropTypes.string.isRequired,
  sketchId: React.PropTypes.string.isRequired
}

export default Shot
