import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Item = styled(Link)`
  color: palevioletred;
  display: block;
  margin: 0.5em 0;
  font-family: Helvetica, Arial, sans-serif;

  &:hover {
    text-decoration: underline;
  }
`

const SketchesNav = ({ items }) => (
  <nav>
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Item to={`/sketches/view/${item.id}`}>{item.title}</Item>
        </li>
      ))}
      <li><Item to='/sketches/add'>Add</Item></li>
    </ul>
  </nav>
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
