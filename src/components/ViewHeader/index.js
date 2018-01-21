import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Wrapper = styled.h1`
  font-weight: normal;
  font-size: 1.2rem;
  background: ${theme.bgColorDark2};
  padding: 0.5rem;
  margin: -0.5rem -0.5rem 0.5rem;
  border-bottom: 1px solid ${theme.lineColor2};
  color: ${theme.textColorLight1};
`

const ViewHeader = ({ children }) => (
  <Wrapper>{children}</Wrapper>
)

ViewHeader.propTypes = {
  children: PropTypes.string.isRequired
}

export default ViewHeader
