import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Node from '../Node'
import Row from '../Row'
import Col from '../Col'
import ParamInputSelect from '../../containers/ParamInputSelect'
import ShotButton from '../../containers/ShotButton'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'
import InfoText from '../InfoText'

const Wrapper = styled(Node)`
  flex: 0 0 33.33%;
  width: 33.33%;
  padding: 0.5rem;
`

const Item = styled.div`
  margin-top: 0.5rem;
`

const Shot = ({ nodeId, modifierIds, lfoOptionIds, title, sketchId, method, infoText }) => (
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
    <InfoText>{infoText}</InfoText>
    {lfoOptionIds && lfoOptionIds.map((id) => (
      <Item key={id}>
        <Select nodeId={id} />
      </Item>
    ))}
    {modifierIds && modifierIds.map((id) => (
      <Item key={id}>
        <Modifier nodeId={id} />
      </Item>
    ))}
  </Wrapper>
)

Shot.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  modifierIds: PropTypes.array,
  sketchId: PropTypes.string,
  method: PropTypes.string,
  lfoOptionIds: PropTypes.array,
  infoText: React.PropTypes.string
}

export default Shot
