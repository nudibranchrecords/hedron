import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  background-color: ${theme.bgColorDark2};
  border-top: 1px solid ${theme.lineColor2};
  min-height: 15rem;
  display: flex;
  flex-direction: column;
`

const Header = styled.h4`
  display: block;
  margin: 0;
  padding: 0.5rem;
  background: ${theme.bgColorDark3};
  color: ${theme.textColorLight1};
`

const Body = styled.div`
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 40vh;
  overflow: auto;
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
