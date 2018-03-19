import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const css = `
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
    background: #212121;
  }

  &.active {
    background: #da5782;
  }

  &.last {
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }
`

const RouterLink = styled(NavLink)`
  ${css}
`

const NormalLink = styled.a`
  ${css}
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
