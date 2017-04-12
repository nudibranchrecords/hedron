import React from 'react'
import Viewer from '../../containers/Viewer'
import Menu from '../../containers/Menu'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Bottom = styled.div`
  margin-top: auto;
`

class Overview extends React.Component {
  render () {
    return (

      <Wrapper>
        <Viewer />
        <div ref={node => node.appendChild(this.props.stats.dom)} />
        <Bottom>
          <Menu />
        </Bottom>
      </Wrapper>

    )
  }
}

export default Overview
