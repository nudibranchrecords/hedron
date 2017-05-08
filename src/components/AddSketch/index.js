import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'

const AddSketch = ({ items, onAddClick }) => (
  <div>
    <h2>Add Sketch</h2>
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <Button onClick={() => onAddClick(item.id)}>{item.title}</Button>
        </li>
      ))}
    </ul>
  </div>
)

AddSketch.propTypes = {
  onAddClick: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.string
    })
  ).isRequired
}

export default AddSketch
