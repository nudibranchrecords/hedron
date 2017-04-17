import React from 'react'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
`

const Sketch = ({ title, paramId, inputId, onInputChange, isLearning }) => (
  <Wrapper>
    {title}
    <br />
    <ParamBar paramId={paramId} />
    {isLearning && 'Learning...' ||
      <select onChange={onInputChange} value={inputId}>
        <option value='none'>None</option>
        <option value='audio_0'>Low</option>
        <option value='audio_1'>Low-Mid</option>
        <option value='audio_2'>Mid</option>
        <option value='audio_3'>High</option>
        <option value='midi'>MIDI</option>
      </select>
    }

  </Wrapper>
)

Sketch.propTypes = {
  title: React.PropTypes.string.isRequired,
  paramId: React.PropTypes.string.isRequired,
  inputId: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  onInputChange: React.PropTypes.func.isRequired,
  isLearning: React.PropTypes.bool
}

export default Sketch
