import React from 'react'
import CurrentSketch from '../../containers/CurrentSketch'
import AddSketch from '../../containers/AddSketch'
import SketchesNav from '../../containers/SketchesNav'
import { Route } from 'react-router'

const App = () => (
  <div>
    <SketchesNav />
    <Route path='/sketches/view/:sketchId' component={CurrentSketch} />
    <Route path='/sketches/add' component={AddSketch} />
  </div>
)

export default App
