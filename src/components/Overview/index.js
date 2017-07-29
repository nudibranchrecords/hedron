import React from 'react'
import PropTypes from 'prop-types'
import Viewer from '../../containers/Viewer'
import Menu from '../../containers/Menu'
import styled from 'styled-components'
import AudioAnalyzer from '../../containers/AudioAnalyzer'
import Clock from '../../containers/Clock'
import Devices from '../../containers/Devices'

const Wrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Bottom = styled.div`
  margin-top: 3rem;
`

const Tools = styled.div`
  display: flex;
  margin-bottom: 1rem;

  & > div {
    height: 48px
  }
`

const Scroller = styled.div`
  flex: 1;
  overflow: scroll;
`

class Overview extends React.Component {
  render () {
    return (

      <Wrapper>
        <Viewer />
        <Tools>
          <div><div ref={node => node && node.appendChild(this.props.stats.dom)} /></div>
          <div><AudioAnalyzer /></div>
          <div><Clock /></div>
        </Tools>

        <Scroller>
          <Devices />

          <Bottom>
            <Menu />
          </Bottom>
        </Scroller>
      </Wrapper>

    )
  }
}

Overview.propTypes = {
  stats: PropTypes.shape({
    dom: PropTypes.object
  }).isRequired
}

export default Overview
