import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import uiEventEmitter from '../../utils/uiEventEmitter'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  position: absolute;
  right: -0.5rem;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
  width: 1rem;

  &:after {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 50%;
    display: block;
    content: "";
    border-right: 1px dashed ${theme.lineColor1};
  }
`
class PanelDragger extends React.Component {

  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  handleMouseDown (e) {
    this.pos = e.nativeEvent.screenX
    this.currentPos = this.props.position

    const onMouseUp = (e) => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', this.handleMouseMove)
    }

    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  componentDidMount () {
    // Force repaint after mounting to fix up components
    setTimeout(() => {
      uiEventEmitter.emit('repaint')
    }, 1000)
  }

  handleMouseMove (e) {
    const diff = (e.screenX - this.pos) / window.innerWidth * 100
    const newVal = Math.max(0, Math.min(100, this.currentPos + diff))
    this.props.onHandleDrag(newVal)
    setTimeout(() => {
      uiEventEmitter.emit('repaint')
    })
  }

  render () {
    return (<Wrapper onMouseDown={this.handleMouseDown} />)
  }

}

export default PanelDragger

PanelDragger.propTypes = {
  onHandleDrag: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired
}
