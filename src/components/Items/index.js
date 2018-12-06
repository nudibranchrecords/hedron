import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.25rem 1rem;
  position: relative;
  flex-direction: ${props => props.direction || 'row'};
`
const Items = ({ children, direction }) => (
  <Wrapper direction={direction}>{children}</Wrapper>
)

Items.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.string,
}

export default Items
