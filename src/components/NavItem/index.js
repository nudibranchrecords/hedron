import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'
import theme from '../../utils/theme'

const baseLink = css`
  display: block;
  padding: 0.5rem 0.25rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: #222;
  color: white;
  text-decoration: none;
  border-top: 1px solid #333;
  cursor: pointer;

  &:hover {
    background: #333333;

    ${props => props.isActive && `background: ${theme.actionColor1};`}
  }

  &.active {
    background: ${theme.actionColor1};
  }

  ${props => props.isActive && `background: ${theme.actionColor1};`}

  &.last {
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }
`

const RouterLink = styled(NavLink)`
  ${baseLink}
`

const NormalLink = styled.a`
  ${baseLink}
`

const NavItem = (props) => {
  if (props.to) {
    return <RouterLink {...props} />
  } else {
    return <NormalLink {...props} />
  }
}

NavItem.propTypes = {
  to: PropTypes.string
}

export default NavItem
