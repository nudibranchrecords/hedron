import React from 'react'
import PropTypes from 'prop-types'
import CurrentSketch from '../../containers/CurrentSketch'
import AddSketch from '../../containers/AddSketch'
import SketchesNav from '../../containers/SketchesNav'
import Macros from '../../containers/Macros'
import Overview from '../Overview'
import { Route } from 'react-router'
import styled from 'styled-components'
import NavItem from '../NavItem'

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #333;
  color: white;
  font-family: sans-serif;
`

const Left = styled.div`
  flex: 0 0 70%;
  position: relative;
  border-right: 1px dashed #666;
`

const Handle = styled.div`
  position: absolute;
  right: -0.5rem;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
  width: 1rem;
`

const Right = styled.div`
  flex: 1;
`

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 3rem;
  background: #111;
  height: 100%;
`

const App = ({ stats }) => (
  <Wrapper>
    <Left>
      <Overview stats={stats} />
      <Handle />
    </Left>
    <Right>
      <Route path='/sketches/view/:sketchId' component={CurrentSketch} />
      <Route path='/sketches/add' component={AddSketch} />
      <Route path='/macros' component={Macros} />
    </Right>
    <Bar>
      <SketchesNav />
      <NavItem to='/macros'>Macros</NavItem>
    </Bar>
  </Wrapper>
)

export default App

App.propTypes = {
  stats: PropTypes.object.isRequired
}
