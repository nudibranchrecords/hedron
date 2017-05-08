import styled from 'styled-components'

const Button = styled.button`
  background: #DA5782;
  border: 0;
  color: white;
  cursor: pointer;

  font-size: ${props => props.size === 'large' ? '1.5rem' : 'auto'};

  &:hover {
    background: #EF6091;
  }
`

export default Button
