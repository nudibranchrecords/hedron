import React from 'react'
import CurrentSketch from '../../containers/CurrentSketch'
import AddSketch from '../../containers/AddSketch'
import SketchesNav from '../../containers/SketchesNav'
import Overview from '../Overview'
import { Route } from 'react-router'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #333;
  color: white;
  font-family: sans-serif;
`

const Left = styled.div`
  flex: 1;
`

const Right = styled.div`
  flex: 1;
`

const Bar = styled.div`
  flex: 0 0 3rem;
`

const App = ({ stats }) => (
  <Wrapper>
    <Left>
      <Overview stats={stats} />
    </Left>
    <Right>
      <Route path='/sketches/view/:sketchId' component={CurrentSketch} />
      <Route path='/sketches/add' component={AddSketch} />
    </Right>
    <Bar>
      <SketchesNav />
    </Bar>
  </Wrapper>
)

export default App

App.propTypes = {
  stats: React.PropTypes.object.isRequired
}
