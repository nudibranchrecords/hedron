import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Node from '../Node'
import Row from '../Row'
import Col from '../Col'
import ParamInputSelect from '../../containers/ParamInputSelect'
import ShotButton from '../../containers/ShotButton'

const Wrapper = styled(Node)`
  flex: 0 0 33.33%;
  padding: 0.5rem;
`

const Shot = (props) => (
  <Wrapper>
    {props.title}
    <Row>
      <Col>
        <ShotButton {...props} />
      </Col>
      <ParamInputSelect nodeId={props.nodeId} />
    </Row>
  </Wrapper>
)

Shot.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired
}

export default Shot
