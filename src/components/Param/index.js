import React from 'react'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
`

const Sketch = ({ title, paramId, onIncomingInputChange }) => (
  <Wrapper>
    {title}
    <br />
    <ParamBar paramId={paramId} />
    <select onChange={onIncomingInputChange}>
      <option value={false}>None</option>
      <option value='audio_0'>Low</option>
      <option value='audio_1'>Low-Mid</option>
      <option value='audio_2'>Mid</option>
      <option value='audio_3'>High</option>
    </select>
  </Wrapper>
)

Sketch.propTypes = {
  title: React.PropTypes.string.isRequired,
  paramId: React.PropTypes.string.isRequired,
  onIncomingInputChange: React.PropTypes.func.isRequired
}

export default Sketch
