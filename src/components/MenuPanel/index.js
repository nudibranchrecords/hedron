import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  background-color: ${theme.bgColorDark2};
  border-top: 1px solid ${theme.lineColor2};
`

const Header = styled.h4`
  display: block;
  padding: 0.5rem;
  background: ${theme.bgColorDark3};
  color: ${theme.textColorLight1};
  cursor: pointer;
`

const Body = styled.div`
  padding: 0.5rem;
`

const MenuPanel = ({ title, children }) => (
  <Wrapper>
    <Header>{title}</Header>
    <Body>
      {children}
    </Body>
  </Wrapper>
)

MenuPanel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}

export default MenuPanel
