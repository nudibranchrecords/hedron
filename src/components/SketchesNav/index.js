import React from 'react'
import { Link } from 'react-router-dom'

const SketchesNav = ({ items }) => (
  <nav>
    <ul>
      {items.map(item => (
        <li><Link to={`/sketches/view/${item.id}`}>{item.title}</Link></li>
      ))}
      <li><Link to='/sketches/add'>Add</Link></li>
    </ul>
  </nav>
)

SketchesNav.propTypes = {
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      title: React.PropTypes.string
    })
  )
}

export default SketchesNav
