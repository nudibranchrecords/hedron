import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Node from '../Node'

import ShotButton from '../../containers/ShotButton'

const Wrapper = styled(Node)`
  flex: 0 0 33.33%;
  padding: 0.5rem;
`

const Shot = (props) => (
  <Wrapper>
    {props.title}
    <ShotButton {...props} />
  </Wrapper>
)

Shot.propTypes = {
  title: PropTypes.string.isRequired
}

export default Shot
