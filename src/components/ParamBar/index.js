import React from 'react'
import styled from 'styled-components'

const Bar = styled.canvas`
  background: black;
  cursor: pointer;
`

class ParamBar extends React.Component {

  componentDidMount () {
    this.width = this.canvas.width = 100
    this.height = this.canvas.height = 10
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const context = this.canvas.getContext('2d')

    context.fillStyle = '#FFFFFF'

    const pos = this.width * nextProps.value
    const oldPos = this.width * this.props.value

    // Only clear the area from the last position
    context.clearRect(oldPos - 1, 0, 4, this.height)

      // Draw bar at new position
    context.fillRect(pos, 0, 2, this.height)
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
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default ParamBar
