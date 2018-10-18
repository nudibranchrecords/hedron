import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'
import SubNode from '../SubNode'
import Row from '../Row'

const BarCol = styled.div`
  flex: 1;
`

const ButtonCol = styled.div`
  flex: 0 0 1rem;
  width: 1rem;
  text-align: right;
  color: red;

  span {
    cursor: pointer;
  }
`

const MacroLink = (
  { title, nodeId, onDeleteClick }
) => (
  <SubNode nodeId={nodeId} title={title} noInfo>
    <Row>
      <BarCol>
        <ParamBar nodeId={nodeId} />
      </BarCol>
      <ButtonCol>
        <span onClick={onDeleteClick}>&times;</span>
      </ButtonCol>
    </Row>
  </SubNode>
)

MacroLink.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
}

export default MacroLink
