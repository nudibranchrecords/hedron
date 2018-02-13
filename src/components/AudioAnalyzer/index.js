import React from 'react'
import PropTypes from 'prop-types'

let height, val, offset, hue, i

class AudioAnalyzer extends React.Component {

  componentDidMount () {
    this.width = this.canvas.width = 80
    this.height = this.canvas.height = 48
    this.barCount = 4
    this.barWidth = this.width / this.barCount
    this.ctx = this.canvas.getContext('2d')

    const loop = () => {
      this.drawGraph(this.props.bands)
      requestAnimationFrame(loop)
    }
    loop()
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
      <canvas ref={node => { this.canvas = node }} />
    )
  }
}

AudioAnalyzer.propTypes = {
  bands: PropTypes.arrayOf(PropTypes.number)
}

export default AudioAnalyzer
