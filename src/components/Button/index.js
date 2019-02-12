import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import tinyColor from 'tinycolor2'
import { Link as RouterLink } from 'react-router-dom'

const sizes = {
  large: '1.5rem',
  small: '0.7rem',
}

const colors = {
  channelA: theme.channelAColor,
  channelB: theme.channelBColor,
  danger: theme.dangerColor,
}

const Inner = styled.span`
  display: block;
  background: ${props => colors[props.color] || theme.actionColor1};
  padding: 0.2rem 0.35rem;
  text-decoration: none;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: ${props => sizes[props.size] || 'auto'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  transition: 0.2s;

  ${props => props.reversed && `
    background: white;
    color: ${theme.actionColor1};
  `}
`

const Wrapper = styled.span`
  display: inline-block;
  
  &:hover {
    ${Inner} {
      background: ${
        props => {
          const col = colors[props.color] || theme.actionColor1
          return tinyColor(col).lighten(5).toString()
        }
      };

      ${props => props.reversed && `
        color: white;
      `}
    }
  }

  &:active {
    ${Inner} {
      transform: scale(0.9);
      transition: 0s;
    }
  }


`

const Link = styled(RouterLink)`
  color: white;
  text-decoration: none;
`

// Anything in ...props could be a function like onClick, onMouseDown, etc
// so we only want that to be given to one element to prevent things firing twice
const Button = ({ color, size, disabled, reversed, children, to, ...props }) =>
  <Wrapper {...props} color={color} size={size} disabled={disabled} reversed={reversed}>
    <Inner color={color} size={size} disabled={disabled} reversed={reversed}>
      {props.to
        ? <Link to={to}>{children}</Link>
        : <a>{children}</a>
      }
    </Inner>
  </Wrapper>

Button.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  reversed: PropTypes.bool,
}

export default Button
