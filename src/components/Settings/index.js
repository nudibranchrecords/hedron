import React from 'react'
import styled from 'styled-components'
import ViewHeader from '../ViewHeader'
import Input from '../Input'
import Row from '../Row'
import Col from '../Col'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Settings = () => (
  <Wrapper>
    <ViewHeader>Settings</ViewHeader>
    <form onSubmit={e => e.preventDefault()}>
      <h2>Clock</h2>
      <Row>
        <Col perc='25'>
          <Input name='clockGenerated' label='Clock Generated' type='checkbox' />
        </Col>
        <Col perc='25'>
          <Input name='clockBpm' label='Clock BPM' type='number' />
        </Col>
      </Row>
      <h2>Aspect Ratio (when not sending to display)</h2>
      <Row>
        <Col perc='10'>
          <Input name='aspectW' label='Width' type='number' />
        </Col>
        <Col perc='10'>
          <Input name='aspectH' label='Height' type='number' />
        </Col>
      </Row>
      <h2>Renderer</h2>
      <Row>
        <Col perc='25'>
          <Input name='antialias' label='Antialiasing' type='checkbox' />
        </Col>
        <Col perc='25'>
          <Input name='throttledFPS' label='Throttled FPS' type='number' />
        </Col>
      </Row>
    </form>
  </Wrapper>
)

export default Settings
