import React from 'react'
import PropTypes from 'prop-types'
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
  canvasRef: PropTypes.func
}

export default Viewer
