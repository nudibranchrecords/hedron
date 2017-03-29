import React from 'react'
import Param from '../../containers/Param'

const Sketch = ({ title, params }) => (
  <div>
    <h2>{title}</h2>

    <ul>
      {params.map((id) => (
        <li key={id}>
          <Param paramId={id} />
        </li>
      ))}
    </ul>
  </div>
)

export default Sketch
