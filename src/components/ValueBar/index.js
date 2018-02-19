import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import uiEventEmitter from '../../utils/uiEventEmitter'
import theme from '../../utils/theme'
import now from 'performance-now'

const Bar = styled.canvas`
  background: ${theme.bgColorDark2};
  cursor: pointer;
`

const Wrapper = styled.div`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    display: ${props => props.markerIsVisible ? 'block' : 'none'};
    left: 33.3%;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: ${theme.actionColor1};
  }
`

class ValueBar extends React.Component {

  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.setSize = this.setSize.bind(this)
    this.draw = this.draw.bind(this)
  }

  componentDidMount () {
    this.containerEl = this.canvas.parentElement
    const height = this.props.type === 'shot' ? 6 : 2
    this.height = 16 * height
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    this.setSize()

    uiEventEmitter.on('repaint', this.setSize)
    uiEventEmitter.on('slow-tick', this.draw)
  }

  getValue () {
    // Grab the value for the param directly from the store
    // This is for performance reasons as it prevents React
    // from doing unecessary (and expensive) diffing
    return this.context.store.getState().nodes[this.props.nodeId].value
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.shotCount !== this.props.shotCount) {
      this.flash()
    }
  }

  componentWillUnmount () {
    clearInterval(this.sizer)
    uiEventEmitter.removeListener('repaint', this.setSize)
    uiEventEmitter.removeListener('slow-tick', this.draw)
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
      this.draw(true)
    }, 1)
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

  draw (force) {
    const newVal = this.getValue()
    const clearShot = now() - this.lastShotTime > 30
    if (newVal !== this.oldVal || force || clearShot) {
      const barWidth = 2
      const innerWidth = this.width - barWidth
      const pos = innerWidth * newVal

      const roundedVal = Math.round(newVal * 1000) / 1000

      this.ctx.font = '18px Arial'
      this.ctx.textAlign = 'right'

      if (this.oldVal && !this.hasShot) {
        const oldPos = innerWidth * this.oldVal
        // Only clear the area from the last position
        this.ctx.clearRect(oldPos - 1, 0, barWidth + 2, this.height)
        // And the text area
        this.ctx.clearRect(this.width - 60, 0, 60, this.height)
      } else {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.hasShot = false
      }

      this.oldVal = newVal

      if (!this.props.hideBar) {
        // Draw value as text
        this.ctx.fillStyle = theme.textColorLight1
        this.ctx.fillText(roundedVal.toFixed(3), innerWidth - 5, this.height - 10)
        // Draw bar at new position
        this.ctx.fillStyle = '#fff'
        this.ctx.fillRect(pos, 0, barWidth, this.height)
      }
    }
  }

  flash () {
    this.lastShotTime = now()
    this.hasShot = true
    this.ctx.fillStyle = theme.actionColor1
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  render () {
    const { markerIsVisible } = this.props
    return (
      <Wrapper markerIsVisible={markerIsVisible}>
        <Bar
          innerRef={node => { this.canvas = node }}
          onMouseDown={this.props.onMouseDown || this.handleMouseDown}
        />
      </Wrapper>
    )
  }
}

ValueBar.propTypes = {
  nodeId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func,
  type: PropTypes.string.isRequired,
  hideBar: PropTypes.bool,
  markerIsVisible: PropTypes.bool,
  shotCount: PropTypes.number
}

ValueBar.contextTypes = {
  store: PropTypes.object.isRequired
}

export default ValueBar
