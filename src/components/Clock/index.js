import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../Button'

const Wrapper = styled.div`
  height: 48px;
  color: white;
  display: flex;
`

const Col = styled.div`
  margin-right: 0.5rem;
`

const Top = styled.div`
  font-size: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TapButton = styled(Button)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const Bottom = styled.div`
  text-align: center;
  margin-bottom: 0.25rem;
`

const Clock = ({ beat, bar, phrase, bpm, onResetClick, onTapTempoClick }) => (
  <Wrapper>
    <Col>
      <Top>{beat} - {bar} - {phrase}</Top>
      <Bottom>{bpm}</Bottom>
      <Button onClick={onResetClick}>Reset</Button>
    </Col>
    <Col>
      <TapButton onClick={onTapTempoClick}>Tap<br />Tempo</TapButton>
    </Col>
  </Wrapper>
)

Clock.propTypes = {
  beat: PropTypes.number.isRequired,
  bar: PropTypes.number.isRequired,
  phrase: PropTypes.number.isRequired,
  bpm: PropTypes.number,
  onResetClick: PropTypes.func.isRequired,
  onTapTempoClick: PropTypes.func.isRequired,
}

export default Clock
