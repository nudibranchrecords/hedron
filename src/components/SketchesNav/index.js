import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.nav`
  background: #111;
  height: 100%;
`

const Item = styled(NavLink)`
  display: block;
  padding: 0.5rem 0.25rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  backround: #222;
  color: white;
  text-decoration: none;
  border-top: 1px solid #333;

  &:hover {
    background: #212121;
  }

  &.active {
    background: #DA5782;
  }

  &.last {
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }
`

const SketchesNav = ({ items }) => (
  <Wrapper>
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Item activeClassName='active' to={`/sketches/view/${item.id}`}>{item.title}</Item>
        </li>
      ))}
      <li><Item className='last' to='/sketches/add'>+</Item></li>
    </ul>
  </Wrapper>
)

SketchesNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
}

export default SketchesNav
