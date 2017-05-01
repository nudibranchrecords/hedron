import React from 'react'
import PropTypes from 'prop-types'
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
  title: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  sketchId: PropTypes.string.isRequired
}

export default Shot
