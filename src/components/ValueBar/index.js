import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import uiEventEmitter from '../../utils/uiEventEmitter'
import theme from '../../utils/theme'

const Bar = styled.canvas`
  background: ${theme.bgColorDark2};
  cursor: pointer;
`

class ValueBar extends React.Component {

  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.setSize = this.setSize.bind(this)
  }

  componentDidMount () {
    this.containerEl = this.canvas.parentElement
    this.height = 16 * 2
    this.canvas.height = this.height

    this.setSize()

    uiEventEmitter.on('repaint', this.setSize)

    this.ticker = setInterval(() => {
      this.draw(this.getValue())
    }, 40)
  }

  getValue () {
    // Grab the value for the param directly from the store
    // This is for performance reasons as it prevents React
    // from doing unecessary (and expensive) diffing
    return this.context.store.getState().nodes[this.props.nodeId].value
  }

  componentWillUnmount () {
    clearInterval(this.ticker)
    clearInterval(this.sizer)
    uiEventEmitter.removeListener('repaint', this.setSize)
  }

  setSize () {
    this.canvas.width = 0
    this.canvas.style.display = 'none'
    this.containerEl.style.display = 'none'
    this.containerEl.style.display = 'block'

    this.sizer = setTimeout(() => {
      this.canvas.style.display = 'block'
      this.width = this.containerEl.offsetWidth * 2
      this.canvas.width = this.width
      this.canvas.style.width = this.width / 2 + 'px'
      this.canvas.style.height = this.height / 2 + 'px'
      this.draw(this.getValue(), true)
    }, 1)
  }

  shouldComponentUpdate () {
    return false
  }

  handleMouseDown (e) {
    this.pos = e.nativeEvent.screenX
    this.currentValue = this.getValue()

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

  draw (newVal, force) {
    if (newVal !== this.oldVal || force) {
      const barWidth = 2
      const innerWidth = this.width - barWidth
      const pos = innerWidth * newVal
      const context = this.canvas.getContext('2d')
      const roundedVal = Math.round(newVal * 1000) / 1000

      context.font = '18px Arial'
      context.textAlign = 'right'

      if (this.oldVal) {
        const oldPos = innerWidth * this.oldVal
        // Only clear the area from the last position
        context.clearRect(oldPos - 1, 0, barWidth + 2, this.height)
        // And the text area
        context.clearRect(this.width - 60, 0, 60, this.height)
      } else {
        context.clearRect(0, 0, this.width, this.height)
      }

      this.oldVal = newVal

      // Draw value as text
      context.fillStyle = theme.textColorLight1
      context.fillText(roundedVal.toFixed(3), innerWidth - 5, this.height - 10)
      // Draw bar at new position
      context.fillStyle = '#fff'
      context.fillRect(pos, 0, barWidth, this.height)
    }
  }

  render () {
    return (
      <div>
        <Bar
          innerRef={node => { this.canvas = node }}
          onMouseDown={this.props.onMouseDown || this.handleMouseDown}
        />
      </div>
    )
  }
}

ValueBar.propTypes = {
  nodeId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func
}

ValueBar.contextTypes = {
  store: PropTypes.object.isRequired
}

export default ValueBar
