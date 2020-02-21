import React from 'react'
import styled from 'styled-components'
import ViewHeader from '../ViewHeader'
import Input from '../Input'
import Row from '../Row'
import Col from '../Col'
import Control from '../../containers/Control'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Settings = () => (
  <Wrapper>
    <ViewHeader>Settings</ViewHeader>
    <form onSubmit={e => e.preventDefault()}>
      <h2>Sketches</h2>
      <Row>
        <Col>
          <Control nodeId='sketchOrganization' />
        </Col>
        <Col>
          <Input name='watchSketchesDir' label='Watch Sketches' type='checkbox' />
        </Col>
      </Row>
      <h2>Clock</h2>
      <Row>
        <Col width='6rem'>
          <Input name='clockGenerated' label='Generated' type='checkbox' />
        </Col>
        <Col width='4rem'>
          <Input name='clockBpm' label='BPM' type='number' />
        </Col>
      </Row>
      <h2>Aspect Ratio (when not sending to display)</h2>
      <Row>
        <Col width='4rem'>
          <Input name='aspectW' label='Width' type='number' />
        </Col>
        <Col width='4rem'>
          <Input name='aspectH' label='Height' type='number' />
        </Col>
      </Row>
      <h2>Renderer</h2>
      <Row>
        <Col width='8rem'>
          <Input name='throttledFPS' label='Throttled FPS' type='number' />
        </Col>
      </Row>
      <h2>GUI</h2>
      <Row>
        <Col noWidth>
          <p>Disable Error Popups</p>
        </Col>
        <Col width='1rem'>
          <Control nodeId='areErrorPopupsDisabled' />
        </Col>
      </Row>
    </form>
  </Wrapper>
)

export default Settings
