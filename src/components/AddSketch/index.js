import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import styled from 'styled-components'

const Items = styled.ul`
  display: flex;
  flex-wrap: wrap;

  & li {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
`

const AddSketch = ({ items, onAddClick }) => (
  <div>
    <h2>Add Sketch</h2>
    <Items>
      {items.map((item) => (
        <li key={item.id}>
          <Button size='large' onClick={() => onAddClick(item.id)}>{item.title}</Button>
        </li>
      ))}
    </Items>
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
