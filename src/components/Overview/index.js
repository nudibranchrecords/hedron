import React from 'react'
import PropTypes from 'prop-types'
import Viewer from '../../containers/Viewer'
import Menu from '../../containers/Menu'
import styled from 'styled-components'
import AudioAnalyzer from '../../components/AudioAnalyzer'
import Clock from '../../containers/Clock'
import Devices from '../../containers/Devices'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`
const Top = styled.div`
  margin-bottom: 3rem;
`

const Bottom = styled.div`
  margin-top: auto;
`

const Tools = styled.div`
  display: flex;
  margin-bottom: 1rem;

  & > div {
    height: 48px;
  }
`

const Scroller = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
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
          <Top>
            <Devices />
          </Top>
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
