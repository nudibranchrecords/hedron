import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const Item = styled(NavLink)`
  display: block;
  padding: 0.5rem 0.25rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: #222;
  color: white;
  text-decoration: none;
  border-top: 1px solid #333;

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

export default Item
