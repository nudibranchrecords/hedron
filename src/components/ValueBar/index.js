import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Bar = styled.canvas`
  background: black;
  cursor: pointer;
`

const win = nw.Window.get()

class ParamBar extends React.Component {

  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.setSize = this.setSize.bind(this)
  }

  componentDidMount () {
    this.containerEl = this.canvas.parentElement
    this.width = this.canvas.width = this.containerEl.offsetWidth
    this.height = this.canvas.height = 16

    this.setSize()

    win.on('resize', this.setSize)
  }

  componentWillUnmount () {
    win.removeListener('resize', this.setSize)
  }

  setSize () {
    this.canvas.width = 0
    this.width = this.canvas.width = this.containerEl.offsetWidth
  }

  componentWillReceiveProps (nextProps) {
    const context = this.canvas.getContext('2d')
    const barWidth = 2
    const innerWidth = this.width - barWidth

    context.fillStyle = '#FFFFFF'

    const pos = innerWidth * nextProps.value
    const oldPos = innerWidth * this.props.value

    // Only clear the area from the last position
    context.clearRect(oldPos - 1, 0, barWidth + 2, this.height)

      // Draw bar at new position
    context.fillRect(pos, 0, barWidth, this.height)
  }

  handleMouseDown (e) {
    this.pos = e.nativeEvent.screenX
    this.currentValue = this.props.value

    const onMouseUp = (e) => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', this.handleMouseMove)
    }

    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  handleMouseMove (e) {
    const diff = (e.screenX - this.pos) / this.width
    const newVal = Math.max(0, Math.min(1, this.currentValue + diff))
    this.props.onChange(newVal)
  }

  render () {
    return (
      <div>
        <Bar
          innerRef={node => { this.canvas = node }}
          onMouseDown={this.handleMouseDown}
        />
      </div>
    )
  }
}

ParamBar.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ParamBar
