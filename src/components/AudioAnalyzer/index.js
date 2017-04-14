import React from 'react'

class AudioAnalyzer extends React.Component {

  componentDidMount () {
    this.width = this.canvas.width = 80
    this.height = this.canvas.height = 48
    this.barCount = 4
    this.barWidth = this.width / this.barCount

    const loop = () => {
      this.drawGraph(this.props.bands)
      requestAnimationFrame(loop)
    }
    loop()
  }

  drawGraph (data) {
    if (!data) return

    let ctx = this.canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, this.width, this.height)

    // Create background bars
    for (let i = 0; i < data.length; i++) {
      const val = data[ i ]
      const height = this.height * val
      const offset = this.height - height - 1
      const hue = i / data.length * 360

      ctx.fillStyle = 'hsla(' + hue + ', 100%, 50%, 1)'
      ctx.fillRect(i * this.barWidth, offset, this.barWidth, height)
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
  bands: React.PropTypes.arrayOf(React.PropTypes.number)
}

export default AudioAnalyzer
