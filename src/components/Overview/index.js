import React from 'react'
import PropTypes from 'prop-types'
import Viewer from '../../containers/Viewer'
import ProjectDetails from '../../containers/ProjectDetails'
import styled from 'styled-components'
import Crossfader from '../../containers/Crossfader'
import AudioAnalyzer from '../../containers/AudioAnalyzer'
import Clock from '../../containers/Clock'
import SceneManager from '../../containers/SceneManager'
import ConnectedDevices from '../../containers/ConnectedDevices'
import Node from '../../containers/Node'
import OverviewPropertiesPanel from '../../containers/OverviewPropertiesPanel'
import theme from '../../utils/theme'

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
  margin-bottom: 0.5rem;
`

const Tools = styled.div`
  display: flex;
  margin-bottom: 1rem;
  background: ${theme.bgColorDark3};
  padding: 0.5rem;
  align-items: flex-end;

  & > div {
    display: flex;
    align-items: flex-end;
    height: 48px;
    margin-right: 0.5rem
  }
`

const Scroller = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
`

const PanelWrapper = styled.div`
  margin: 0 -0.5rem -0.5rem -0.5rem;
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
          <div><Node nodeId='viewerMode' panelId='overview' theme='light' /></div>
        </Tools>

        <Crossfader />

        <Scroller>
          <Top>
            <SceneManager />
          </Top>
          <Bottom>
            <ConnectedDevices />
            <ProjectDetails />
          </Bottom>
        </Scroller>
        <PanelWrapper>
          <OverviewPropertiesPanel />
        </PanelWrapper>
      </Wrapper>

    )
  }
}

Overview.propTypes = {
  stats: PropTypes.shape({
    dom: PropTypes.object,
  }).isRequired,
}

export default Overview
