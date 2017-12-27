import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`

class Viewer extends React.Component {
  render () {
    return (
      <Wrapper>
        <canvas ref={this.props.canvasRef}
          style={{
            position: 'absolute',
            left: 0,
            top:0,
            height: '100%',
            width: '100%'
          }}
        />
      </Wrapper>
    )
  }
}

Viewer.propTypes = {
  canvasRef: PropTypes.func
}

export default Viewer
