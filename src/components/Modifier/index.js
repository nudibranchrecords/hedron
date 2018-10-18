import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'
import MidiButton from '../MidiButton'
import SubNode from '../SubNode'
import Row from '../Row'

const BarCol = styled.div`
  flex: 1;
`

const ButtonCol = styled.div`
  flex: 0 0 1rem;
  width: 1rem;
`

const Modifier = (
  { title, nodeId, onAssignClick }
) => (
  <SubNode nodeId={nodeId} title={title}>
    <Row>
      <BarCol>
        <ParamBar nodeId={nodeId} />
      </BarCol>
      <ButtonCol>
        <MidiButton onClick={onAssignClick} />
      </ButtonCol>
    </Row>
  </SubNode>
)

Modifier.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  onAssignClick: PropTypes.func.isRequired,
}

export default Modifier
