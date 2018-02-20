import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import { Link as RouterLink } from 'react-router-dom'

const css = `
  background: ${theme.actionColor1};
  display: inline-block;
  padding: 0.2rem 0.35rem;
  text-decoration: none;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: ${props => props.size === 'large' ? '1.5rem' : 'auto'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background: #ef6091;
  }

  ${props => props.reversed && `
    background: white;
    color: ${theme.actionColor1};

    &:hover {
      color: white;
    }
  `}
`

const Plain = styled.button`
  ${css}
`

const Link = styled(RouterLink)`
  ${css}
`

const Button = (props) => {
  if (props.to) {
    return (<Link to='/' {...props} />)
  } else {
    return (<Plain {...props} />)
  }
}

Button.propTypes = {
  to: PropTypes.string
}

export default Button
