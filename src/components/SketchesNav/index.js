import React from 'react'
import { Link } from 'react-router-dom'

const SketchesNav = () => (
  <nav>
    <Link to='/sketches/sketch_1'>Sketch 1</Link>
    <Link to='/sketches/sketch_2'>Sketch 2</Link>
  </nav>
)

export default SketchesNav
