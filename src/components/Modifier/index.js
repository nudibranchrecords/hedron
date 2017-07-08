import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'
import MidiButton from '../MidiButton'
import SubNode from '../SubNode'
import Row from '../Row'
import InputLinkTags from '../InputLinkTags'

const BarCol = styled.div`
  flex: 1;
`

const ButtonCol = styled.div`
  flex: 0 0 1rem;
  width: 1rem;
`

const Info = styled(Row)`
  margin-top: 0.25rem;
`

const Modifier = (
  { title, nodeId, onAssignClick, isLearningMidi, inputLinkIds }
) => (
  <SubNode>
    {title}
    <Row>
      <BarCol>
        <ParamBar nodeId={nodeId} />
      </BarCol>
      <ButtonCol>
        <MidiButton onClick={onAssignClick} />
      </ButtonCol>
    </Row>
    <Info align='center'>
      {isLearningMidi
        ? 'Learning MIDI...'
        : <InputLinkTags ids={inputLinkIds} />
      }
    </Info>
  </SubNode>
)

Modifier.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  onAssignClick: PropTypes.func.isRequired,
  isLearningMidi: PropTypes.bool,
  inputLinkIds: PropTypes.array.isRequired
}

export default Modifier
