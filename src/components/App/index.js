import React from 'react'
import CurrentSketch from '../../containers/CurrentSketch'
import AddSketch from '../../containers/AddSketch'
import SketchesNav from '../../containers/SketchesNav'
import Viewer from '../../containers/Viewer'
import Menu from '../../containers/Menu'
import { Route } from 'react-router'

const App = () => (
  <div>
    <SketchesNav />
    <Viewer />
    <Route path='/sketches/view/:sketchId' component={CurrentSketch} />
    <Route path='/sketches/add' component={AddSketch} />
    <Menu />
  </div>
)

export default App
