import React from 'react'
import PropTypes from 'prop-types'
import MidiButton from '../../components/MidiButton'
import InputLinkTags from '../../components/InputLinkTags'
import Row from '../../components/Row'
import styled from 'styled-components'

const Col = styled.div`
  margin-right: 0.25rem;
`
const InputLinkMidiControl = ({ onAssignClick, inputLinkIds }) => (
  <Row align='center'>
    <Col>
      <MidiButton onClick={onAssignClick} />
    </Col>
    <InputLinkTags ids={inputLinkIds} />
  </Row>
)

InputLinkMidiControl.propTypes = {
  onAssignClick: PropTypes.func.isRequired,
  inputLinkIds: PropTypes.array.isRequired,
}

export default InputLinkMidiControl
