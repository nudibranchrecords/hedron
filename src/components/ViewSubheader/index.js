import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Wrapper = styled.h2`
  font-weight: normal;
  font-size: 1rem;
`

const ViewHeader = ({ children }) => (
  <Wrapper>{children}</Wrapper>
)

ViewHeader.propTypes = {
  children: PropTypes.string.isRequired
}

export default ViewHeader
