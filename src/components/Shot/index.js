import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Node from '../Node'
import ParamInputSelect from '../../containers/ParamInputSelect'
import NodeInputInfo from '../../containers/NodeInputInfo'
import ShotButton from '../../containers/ShotButton'
import InputLink from '../../containers/InputLink'

const Wrapper = styled(Node)`
  flex: 0 0 25%;
  width: 25%;
  padding: 0.5rem;
`

const Part = styled.div`
  margin-bottom: 0.25rem;
`

const Shot = ({ nodeId, modifierIds, title, sketchId, method, inputLinkIds }) => (
  <Wrapper>
    <Part>
      {title}
    </Part>
    <Part>
      <ShotButton sketchId={sketchId} method={method} nodeId={nodeId} />
    </Part>
    <Part>
      <ParamInputSelect nodeId={nodeId} />
    </Part>
    <NodeInputInfo nodeId={nodeId} />
    {inputLinkIds.map(id => (
      <InputLink id={id} key={id} size='small' />
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
