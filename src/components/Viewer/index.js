import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  background: ${theme.bgColorDark2};
  overflow: hidden;

  > canvas {
    position: absolute;
    left: 0;
    top:0;
    height: 100%;
    width: 100%;
  }
`

class Viewer extends React.Component {
  render () {
    return (
      <Wrapper ref={this.props.containerElRef} id='viewer' />
    )
  }
}

Viewer.propTypes = {
  containerElRef: PropTypes.func,
}

export default Viewer
