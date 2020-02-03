import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import now from 'performance-now'
import uiEventEmitter from '../../utils/uiEventEmitter'
import theme from '../../utils/theme'
import ParamValueForm from '../../containers/ParamValueForm'
import { ReactReduxContext } from 'react-redux'

const pixelDensity = 2

const Bar = styled.canvas`
  background: ${props => props.theme === 'panel' ? theme.bgColorDark3 : theme.bgColorDark2};
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
    width: 0;
    border-left: 1px solid ${theme.actionColor1};
  }
`

const ValueForm = styled.div`
  position: absolute;
  width: 2.5rem;
  height: 0.5rem;
  top: 0;
  right: 0;
  z-index: 1;

  & input {
    font-size: 0.7rem !important;
    padding: 0.15rem !important;
    text-align: right;
  }
`

class ValueBar extends React.Component {
  static contextType = ReactReduxContext

  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.setSize = this.setSize.bind(this)
    this.clearSize = this.clearSize.bind(this)
    this.draw = this.draw.bind(this)
    this.flashFading = false
  }

  componentDidMount () {
    this.containerEl = this.canvas.parentElement
    const height = this.props.type === 'shot' ? 4 : 2.2
    this.height = 16 * height
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    this.setSize()

    uiEventEmitter.on('repaint', this.setSize)
    uiEventEmitter.on('slow-tick', this.draw)
    uiEventEmitter.on('panel-resize-start', this.clearSize)

    this.shotCount = this.getData().shotCount
  }

  getData () {
    // Grab the value for the param directly from the store
    // This is for performance reasons as it prevents React
    // from doing unecessary (and expensive) diffing
    const node = this.context.store.getState().nodes[this.props.nodeId]
    return {
      value: node.value,
      shotCount: node.shotCount,
    }
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.markerIsVisible !== this.props.markerIsVisible ||
      nextProps.hideBar !== this.props.hideBar ||
      nextProps.formIsVisible !== this.props.formIsVisible
    )
  }

  componentWillUnmount () {
    clearInterval(this.sizer)
    uiEventEmitter.removeListener('repaint', this.setSize)
    uiEventEmitter.removeListener('slow-tick', this.draw)
    uiEventEmitter.removeListener('panel-resize-start', this.clearSize)
  }

  setSize () {
    this.clearSize()

    this.sizer = setTimeout(() => {
      this.width = this.containerEl.offsetWidth * pixelDensity
      this.canvas.style.display = 'block'
      this.canvas.width = this.width
      this.canvas.style.width = this.width / pixelDensity + 'px'
      this.canvas.style.height = this.height / pixelDensity + 'px'
      this.draw(true)
    })
  }

  clearSize () {
    this.canvas.width = 0
    this.canvas.style.display = 'none'
    this.containerEl.style.display = 'none'
    this.containerEl.style.display = 'block'
  }

  handleMouseDown (e) {
    this.pos = e.nativeEvent.screenX
    this.currentValue = this.getData().value

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
    const data = this.getData()
    const newVal = data.value
    const shotCount = data.shotCount
    let flashOpacity = 0

    // Flash if new shot has happened
    if (shotCount !== this.shotCount) {
      this.shotCount = shotCount
      this.flashFading = true
      this.lastShotTime = now()
    }

    if (this.lastShotTime) {
      flashOpacity = 1 - ((now() - this.lastShotTime) / 200)
    }

    if (newVal !== this.oldVal || force || this.flashFading) {
      const barWidth = 2
      const innerWidth = this.width - barWidth
      const pos = innerWidth * newVal

      const roundedVal = Math.round(newVal * 1000) / 1000

      this.ctx.font = '20px Arial'
      this.ctx.textAlign = 'right'

      if (this.oldVal && flashOpacity < 0 && !this.flashIsPainted) {
        const oldPos = innerWidth * this.oldVal
        // Only clear the area from the last position
        this.ctx.clearRect(oldPos - 1, 0, barWidth + 2, this.height)
        // And the text area
        this.ctx.clearRect(this.width - 60, 0, 60, this.height)
      } else {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.flashIsPainted = false
      }

      if (this.flashFading) {
        this.ctx.fillStyle = `rgba(218,87,130,${flashOpacity})`
        this.ctx.fillRect(0, 0, this.width, this.height)
        this.flashIsPainted = true

        if (flashOpacity === 0) {
          this.flashFading = false
        }
      }

      this.oldVal = newVal

      if (!this.props.hideBar) {
        // Draw value as text
        this.ctx.fillStyle = theme.textColorLight1
        this.ctx.fillText(roundedVal.toFixed(3), innerWidth - 8, this.height - 11)
        // Draw bar at new position
        this.ctx.fillStyle = '#fff'
        this.ctx.fillRect(pos, 0, barWidth, this.height)
      }
    }
  }

  render () {
    const { markerIsVisible, theme } = this.props
    return (
      <Wrapper markerIsVisible={markerIsVisible} onDoubleClick={this.props.onDoubleClick}>
        <Bar
          ref={node => { this.canvas = node }}
          theme={theme}
          onMouseDown={this.props.onMouseDown || this.handleMouseDown}
        />
        {this.props.formIsVisible &&
          <ValueForm onMouseDown={e => e.stopPropagation()}>
            <ParamValueForm id={this.props.nodeId} />
          </ValueForm>
        }
      </Wrapper>
    )
  }
}

ValueBar.propTypes = {
  nodeId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  type: PropTypes.string,
  hideBar: PropTypes.bool,
  formIsVisible: PropTypes.bool,
  markerIsVisible: PropTypes.bool,
  theme: PropTypes.string,
}

export default ValueBar
