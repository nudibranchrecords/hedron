import React from 'react'
import PropTypes from 'prop-types'
import uiEventEmitter from '../../utils/uiEventEmitter'
import Control from '../../containers/Control'
import styled, { css } from 'styled-components'
import theme from '../../utils/theme'

let height, val, offset, hue, i, inputs, bands

const triH = 8

const Wrapper = styled.div`
  position: relative;
`

const Container = styled.div`
  cursor: pointer;
`

const triangle = css`
  position: absolute;
  left: 50%;
  top: -${triH}px;
  margin-left: -${triH}px;
  content: "";
  display: block;
  width: 0;
  height: 0;
  border-bottom: ${triH}px solid ${theme.bgColorDark1};;
  border-left: ${triH}px solid transparent;
  border-right: ${triH}px solid transparent;
`

const SettingsBox = styled.div`
  left: 50%;
  width: 9rem;
  margin-left: -4.5rem;
  margin-top: 0.25rem;
  border: 1px solid white;
  background: ${theme.bgColorDark1};
  position: absolute;
  padding: 0.5rem 0.25rem 0.25rem 0.5rem;

  &:after {
    ${triangle}
  }

  &:before {
    ${triangle}
    border-bottom-color: white;
    border-width: ${triH + 2}px;
    margin-left: -${triH + 2}px;
    margin-top: -2px;
  }
`

class AudioAnalyzer extends React.Component {

  constructor (props) {
    super(props)
    this.draw = this.draw.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.isOpen = false
  }

  componentDidMount () {
    this.width = this.canvas.width = 80
    this.height = this.canvas.height = 48
    this.barCount = 4
    this.barWidth = this.width / this.barCount
    this.ctx = this.canvas.getContext('2d')

    uiEventEmitter.on('slow-tick', this.draw)
  }

  componentWillUnmount () {
    uiEventEmitter.removeListener('slow-tick', this.draw)
  }

  handleMouseDown (e) {
    this.isOpen = !this.isOpen
    this.forceUpdate()
  }

  draw () {
    inputs = this.context.store.getState().inputs
    bands = [inputs.audio_0.value, inputs.audio_1.value, inputs.audio_2.value, inputs.audio_3.value]
    this.drawGraph(bands)
  }

  drawGraph (data) {
    if (!data) return

    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Create background bars
    for (i = 0; i < data.length; i++) {
      val = data[ i ]
      height = this.height * val
      offset = this.height - height - 1
      hue = i / data.length * 360

      this.ctx.fillStyle = 'hsla(' + hue + ', 100%, 50%, 1)'
      this.ctx.fillRect(i * this.barWidth, offset, this.barWidth, height)
    }
  }

  shouldComponentUpdate () { return false }

  render () {
    return (
      <Wrapper>
        <Container>
          <canvas ref={node => { this.canvas = node }}
            onMouseDown={this.props.onMouseDown || this.handleMouseDown} />
        </Container>
        {this.isOpen &&
          <SettingsBox>
            <Control nodeId='audioNormalizeLevels' />
            <Control nodeId='audioLevelsFalloff' />
          </SettingsBox>
        }
      </Wrapper>
    )
  }
}

AudioAnalyzer.contextTypes = {
  store: PropTypes.object.isRequired
}
AudioAnalyzer.propTypes = {
  onMouseDown: PropTypes.func
}

export default AudioAnalyzer
