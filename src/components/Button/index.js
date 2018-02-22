import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import { Link as RouterLink } from 'react-router-dom'

const sizes = {
  large: '1.5rem',
  small: '0.7rem'
}

const Wrapper = styled.span`
  background: ${theme.actionColor1};
  display: inline-block;
  padding: 0.2rem 0.35rem;
  text-decoration: none;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: ${props => sizes[props.size] || 'auto'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  transition: 0.2s;

  &:hover {
    background: #ef6091;


  &:active {
    transform: scale(0.9);
    transition: 0s;
  }

  ${props => props.reversed && `
    background: white;
    color: ${theme.actionColor1};

    &:hover {
      color: white;
    }
  `}
`

const Link = styled(RouterLink)`
  color: white;
  text-decoration: none;
`

const Button = (props) => {
  return (
    <Wrapper {...props}>
      {props.to
        ? <Link to='/' {...props} />
        : <a>{props.children}</a>
      }
    </Wrapper>

  )
}

Button.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default Button
