import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../Button'
import { useStore } from 'react-redux'
import getClockData from '../../selectors/getClockData'
import useRaf from '../../utils/customReactHooks/useRaf'

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

// Optimised component as it is being updated every beat
const ClockData = () => {
  const store = useStore()
  const topEl = useRef()
  const bottomEl = useRef()
  const prevBeat = useRef()

  useRaf(() => {
    const data = getClockData(store.getState())
    const { beat, bar, phrase, bpm } = data

    if (beat === prevBeat.current) return

    topEl.current.innerText = `${beat} - ${bar} - ${phrase}`
    bottomEl.current.innerText = bpm

    prevBeat.current = beat
  })

  return (
    <>
      <Top ref={topEl} />
      <Bottom ref={bottomEl} />
    </>
  )
}

const Clock = ({ onResetClick, onTapTempoClick }) => (
  <Wrapper>
    <Col>
      <ClockData />
      <Button onMouseDown={onResetClick}>Reset</Button>
    </Col>
    <Col>
      <TapButton onMouseDown={onTapTempoClick}>Tap<br />Tempo</TapButton>
    </Col>
  </Wrapper>
)

Clock.propTypes = {
  onResetClick: PropTypes.func.isRequired,
  onTapTempoClick: PropTypes.func.isRequired,
}

export default Clock
