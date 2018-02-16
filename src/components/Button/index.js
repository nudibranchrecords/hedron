import styled from 'styled-components'
import theme from '../../utils/theme'

const Button = styled.button`
  background: ${theme.actionColor1};
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

export default Button
