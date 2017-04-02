import React from 'react'
import Param from '../../containers/Param'
import styled from 'styled-components'

const Items = styled.ul`
  list-style: none;
  padding: 0;
`

const Sketch = ({ title, params, onDeleteClick }) => (
  <div>
    <h2>{title}</h2>

    <Items>
      {params.map((id) => (
        <li key={id}>
          <Param paramId={id} />
        </li>
      ))}
    </Items>

    <button onClick={onDeleteClick}>Delete Sketch</button>
  </div>
)

Sketch.propTypes = {
  title: React.PropTypes.string.isRequired,
  params: React.PropTypes.arrayOf(
    React.PropTypes.string
  ).isRequired,
  onDeleteClick: React.PropTypes.func.isRequired
}

export default Sketch
