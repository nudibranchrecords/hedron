import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'
import Icon from '../Icon'
import midiIcon from '../../assets/icons/midi.svg'
import InfoText from '../InfoText'

const Row = styled.div`
  display: flex;
`

const BarCol = styled.div`
  flex: 1;
`

const MidiButton = styled(Icon)`
  cursor: pointer;

  &:hover {
    fill: #DA5782
  }
`

const Modifier = ({ title, nodeId, infoText, onAssignClick }) => (
  <div>
    {title}
    <Row>
      <BarCol>
        <ParamBar nodeId={nodeId} />
      </BarCol>
      <MidiButton glyph={midiIcon} onClick={onAssignClick} />
    </Row>
    <InfoText>{infoText}</InfoText>
  </div>
)

Modifier.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  onAssignClick: PropTypes.func.isRequired,
  infoText: React.PropTypes.string
}

export default Modifier
