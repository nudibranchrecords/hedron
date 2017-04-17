import React from 'react'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
`

const Info = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
`

const Sketch = ({ title, paramId, inputId, onInputChange, isLearning, midiText }) => (
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
    <br />
    {midiText && <Info>{midiText}</Info>}
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
  isLearning: React.PropTypes.bool,
  midiText: React.PropTypes.string
}

export default Sketch
