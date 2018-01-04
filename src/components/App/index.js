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
import PanelDragger from '../PanelDragger'

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #333;
  color: white;
  font-family: sans-serif;
`

const Left = styled.div`
  flex: 0 0 ${props => props.width}%;
  position: relative;
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

const App = ({ stats, leftWidth, onLeftDrag }) => (
  <Wrapper>
    <Left width={leftWidth}>
      <Overview stats={stats} />
      <PanelDragger onHandleDrag={onLeftDrag} position={leftWidth} />
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
  stats: PropTypes.object.isRequired,
  leftWidth: PropTypes.number.isRequired,
  onLeftDrag: PropTypes.func.isRequired
}
