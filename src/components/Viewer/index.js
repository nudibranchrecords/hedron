import React from 'react'

class Viewer extends React.Component {
  render () {
    return (
      <canvas ref={this.props.canvasRef} />
    )
  }
}

Viewer.propTypes = {
  canvasRef: React.PropTypes.func
}

export default Viewer
