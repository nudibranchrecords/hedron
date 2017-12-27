import styled from 'styled-components'

const Button = styled.button`
  background: #da5782;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: ${props => props.size === 'large' ? '1.5rem' : 'auto'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background: #ef6091;
  }
`

export default Button
