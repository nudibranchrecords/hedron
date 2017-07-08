import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Node from '../Node'
import Row from '../Row'
import Col from '../Col'
import ParamInputSelect from '../../containers/ParamInputSelect'
import NodeInputInfo from '../../containers/NodeInputInfo'
import ShotButton from '../../containers/ShotButton'
import InputLink from '../../containers/InputLink'

const Wrapper = styled(Node)`
  flex: 0 0 33.33%;
  width: 33.33%;
  padding: 0.5rem;
`

const Item = styled.div`
  margin-top: 0.5rem;
`

const Shot = ({ nodeId, modifierIds, title, sketchId, method, inputLinkIds }) => (
  <Wrapper>
    {title}
    <Row>
      <Col>
        <ShotButton sketchId={sketchId} method={method} nodeId={nodeId} />
      </Col>
      <Col>
        <ParamInputSelect nodeId={nodeId} />
      </Col>
    </Row>
    <NodeInputInfo nodeId={nodeId} />
    {inputLinkIds.map(id => (
      <InputLink id={id} key={id} />
    ))}
  </Wrapper>
)

Shot.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  modifierIds: PropTypes.array,
  sketchId: PropTypes.string,
  method: PropTypes.string,
  inputLinkIds: PropTypes.arrayOf(
    PropTypes.string
  )
}

export default Shot
