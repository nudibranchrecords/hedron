import React from 'react'
import CurrentSketch from '../../containers/CurrentSketch'
import SketchesNav from '../SketchesNav'
import { Route } from 'react-router'

const App = () => (
  <div>
    <SketchesNav />
    <Route path='/sketches/:sketchId' component={CurrentSketch} />
  </div>
)

export default App
