import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 48px;
  color: white;
  width: 80px;
  padding: 0.5rem;
`

const Top = styled.div`
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Bottom = styled.div`
  text-align: center;
`

const Clock = ({ beat, bar, phrase, bpm }) => (
  <Wrapper>
    <Top>{beat} - {bar} - {phrase}</Top>
    <Bottom>{bpm}</Bottom>
  </Wrapper>
)

Clock.propTypes = {
  beat: React.PropTypes.number.isRequired,
  bar: React.PropTypes.number.isRequired,
  phrase: React.PropTypes.number.isRequired,
  bpm: React.PropTypes.number.isRequired
}

export default Clock
