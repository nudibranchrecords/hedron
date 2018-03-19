import React from 'react'
import PropTypes from 'prop-types'
import Sketch from '../../components/Sketch'

const CurrentSketch = (props) =>
  props.isSketch
    ? <Sketch {...props} />
    : <div>No sketch!</div>

CurrentSketch.propTypes = {
  isSketch: PropTypes.bool
}

export default CurrentSketch
