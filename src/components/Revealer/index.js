import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import IconComponent from '../Icon'
import downIcon from '../../assets/icons/down.icon.txt'
import theme from '../../utils/theme'

const Wrapper = styled.div`

`

const Header = styled.a`
  display: flex;
  color: ${theme.textColorLight1};
  fill: ${theme.textColorLight1};
  cursor: pointer;

  &:hover {
    color: ${theme.actionColor1};
    fill: ${theme.actionColor1};
  }
`

const Body = styled.div`
  padding-top: 0.5rem;
`

const Icon = styled(IconComponent)`
  transform: rotate(${props => props.isOpen ? '0deg' : '-90deg'});
`

const Revealer = ({ children, isOpen, title, onHeaderClick }) => (
  <Wrapper>
    <Header onClick={onHeaderClick}><Icon isOpen={isOpen} glyph={downIcon} /> {title}</Header>
    {
      isOpen &&
        <Body>
          {children}
        </Body>
    }
  </Wrapper>
)

Revealer.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onHeaderClick: PropTypes.func.isRequired
}

export default Revealer
