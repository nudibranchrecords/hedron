import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'
import MidiButton from '../MidiButton'
import InfoText from '../InfoText'
import SubNode from '../SubNode'

const Row = styled.div`
  display: flex;
`

const BarCol = styled.div`
  flex: 1;
`

const Modifier = ({ title, nodeId, infoText, onAssignClick }) => (
  <SubNode>
    {title}
    <Row>
      <BarCol>
        <ParamBar nodeId={nodeId} />
      </BarCol>
      <MidiButton onClick={onAssignClick} />
    </Row>
    <InfoText>{infoText}</InfoText>
  </SubNode>
)

Modifier.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  onAssignClick: PropTypes.func.isRequired,
  infoText: React.PropTypes.string
}

export default Modifier
