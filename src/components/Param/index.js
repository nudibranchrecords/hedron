import React from 'react'
import ParamBar from '../../containers/ParamBar'

const Sketch = ({ title, paramId }) => (
  <div>
    {title}
    <br />
    <ParamBar paramId={paramId} />
  </div>
)

export default Sketch
