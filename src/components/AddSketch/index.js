import React from 'react'

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
  onAddClick: React.PropTypes.func,
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      title: React.PropTypes.string,
      id: React.PropTypes.string
    })
  ).isRequired
}

export default AddSketch
