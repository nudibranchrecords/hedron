import React from 'react'
import PropTypes from 'prop-types'
import CurrentSketch from '../../containers/CurrentSketch'
import AddSketch from '../../containers/AddSketch'
import { Route } from 'react-router'

const CurrentScene = ({ match }) => (
  <div>
    <Route path={`${match.url}/view`} component={CurrentSketch} />
    <Route path={`${match.url}/addSketch`} component={AddSketch} />
  </div>
)

CurrentScene.propTypes = {
  match: PropTypes.object.isRequired,
}

export default CurrentScene
