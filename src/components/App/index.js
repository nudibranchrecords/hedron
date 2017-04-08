import React from 'react'
import CurrentSketch from '../../containers/CurrentSketch'
import AddSketch from '../../containers/AddSketch'
import SketchesNav from '../../containers/SketchesNav'
import Viewer from '../../containers/Viewer'
import Save from '../../containers/Save'
import { Route } from 'react-router'

const App = () => (
  <div>
    <SketchesNav />
    <Viewer />
    <Route path='/sketches/view/:sketchId' component={CurrentSketch} />
    <Route path='/sketches/add' component={AddSketch} />
    <Save />
  </div>
)

export default App
