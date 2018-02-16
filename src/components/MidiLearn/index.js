import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../Button'

const Wrapper = styled.div`
  position: fixed;
  background: rgba(0,0,0,0.5);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    font-size: 1rem;
  }
`

const Inner = styled.div`
  background: rgba(0,0,0,0.8);
  border-radius: 10px;
  padding: 3rem;
  text-align: center;
`
const MidiLearn = ({ isVisible, onCancelClick }) => (
  <div>
    {isVisible &&
      <Wrapper>
        <Inner>
          <h2>Learning Midi</h2>
          <p>Use a MIDI control to teach (press a button or twiddle a knob!)</p>
          <Button onClick={onCancelClick}>Cancel</Button>
        </Inner>
      </Wrapper>
    }
  </div>
)

export default MidiLearn

MidiLearn.propTypes = {
  isVisible: PropTypes.bool,
  onCancelClick: PropTypes.func.isRequired
}
