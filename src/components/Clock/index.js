import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 48px;
  color: white;
  width: 80px;
  padding: 0.5rem;
  cursor: pointer;
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

const Clock = ({ beat, bar, phrase, bpm, onClick }) => (
  <Wrapper onClick={onClick}>
    <Top>{beat} - {bar} - {phrase}</Top>
    <Bottom>{bpm}</Bottom>
  </Wrapper>
)

Clock.propTypes = {
  beat: PropTypes.number.isRequired,
  bar: PropTypes.number.isRequired,
  phrase: PropTypes.number.isRequired,
  bpm: PropTypes.number,
  onClick: PropTypes.func.isRequired
}

export default Clock
