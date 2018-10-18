import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import NodeInputInfo from '../../containers/NodeInputInfo'

const Wrapper = styled.div`
  background: #434343;
  padding: 0.3rem 0.5rem;
  border-radius: 3px;
  min-width: 20%;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  flex: 1;
`

const Title = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  color: #eee;
`

const Bottom = styled.div`
  margin-top: 0.25rem;
`

const SubNode = (
  { title, nodeId, children, noInfo }
) => (
  <Wrapper>
    <Title>{title}</Title>
    {children}
    <Bottom>
      {!noInfo && <NodeInputInfo nodeId={nodeId} />}
    </Bottom>
  </Wrapper>
)

SubNode.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  noInfo: PropTypes.bool,
}

export default SubNode
