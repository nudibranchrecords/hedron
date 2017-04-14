import React from 'react'
import Viewer from '../../containers/Viewer'
import Menu from '../../containers/Menu'
import styled from 'styled-components'
import AudioAnalyzer from '../../containers/AudioAnalyzer'

const Wrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Bottom = styled.div`
  margin-top: auto;
`

const Tools = styled.div`
  display: flex;
`

class Overview extends React.Component {
  render () {
    return (

      <Wrapper>
        <Viewer />
        <Tools>
          <div ref={node => node.appendChild(this.props.stats.dom)} />
          <AudioAnalyzer />
        </Tools>

        <Bottom>
          <Menu />
        </Bottom>
      </Wrapper>

    )
  }
}

Overview.propTypes = {
  stats: React.PropTypes.shape({
    dom: React.PropTypes.object
  }).isRequired
}

export default Overview
