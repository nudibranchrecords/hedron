import React from 'react'
import PropTypes from 'prop-types'

const AddSketch = ({ items, onAddClick }) => (
  <div>
    <h2>Add Sketch</h2>
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={() => onAddClick(item.id)}>{item.title}</button>
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
