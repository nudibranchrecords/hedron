import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  flex: 0 0 33.33%;
  width: 33.33%;
  padding: 0.25rem;
`
const Item = ({ children }) => (
  <Wrapper>{children}</Wrapper>
)

Item.propTypes = {
  children: PropTypes.node,
}

export default Item
