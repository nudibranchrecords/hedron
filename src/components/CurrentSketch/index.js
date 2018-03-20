import React from 'react'
import PropTypes from 'prop-types'
import Sketch from '../../components/Sketch'
import ViewHeader from '../ViewHeader'

const CurrentSketch = (props) =>
  props.isSketch
    ? <Sketch {...props} />
    : <div>
      <ViewHeader>No Sketches</ViewHeader>
      <p>Add sketches using the "+" in the right hand menu.</p>
    </div>

CurrentSketch.propTypes = {
  isSketch: PropTypes.bool
}

export default CurrentSketch
