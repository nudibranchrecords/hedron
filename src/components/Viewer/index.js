import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
`

class Viewer extends React.Component {
  render () {
    return (
      <Wrapper>
        <canvas ref={this.props.canvasRef} style={{ width: '100%' }} />
      </Wrapper>
    )
  }
}

Viewer.propTypes = {
  canvasRef: React.PropTypes.func
}

export default Viewer
