import React from 'react'
import PropTypes from 'prop-types'
import Sketch from '../../components/Sketch'
import SceneHeader from '../../containers/SceneHeader'

const CurrentSketch = (props) =>
  props.isSketch
    ? <Sketch {...props} />
    : <div>
      <SceneHeader>No Sketches</SceneHeader>
      <p>Add sketches using the "+" in the right hand menu.</p>
    </div>

CurrentSketch.propTypes = {
  isSketch: PropTypes.bool,
}

export default CurrentSketch
