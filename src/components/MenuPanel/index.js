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
  display: flex;
  margin: 0;
  padding-left: 0.5rem;
  height: 2rem;
  align-items: center;
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

const Icon = styled.span`
  display: block;
  padding: 0.5rem;
  margin-left: auto;
  cursor: pointer;

  &:hover {
    color: ${theme.actionColor1};
  }
`

const MenuPanel = ({ titleContent, children, onCloseClick }) => (
  <Wrapper>
    <Header>
      {titleContent}
      { onCloseClick && <Icon onClick={onCloseClick}>{'×'}</Icon> }
    </Header>
    <Body>
      {children}
    </Body>
  </Wrapper>
)

MenuPanel.propTypes = {
  children: PropTypes.node.isRequired,
  titleContent: PropTypes.node.isRequired,
  onCloseClick: PropTypes.func,
}

export default MenuPanel
