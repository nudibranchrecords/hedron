import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
  margin: 0 0.5rem 0.5rem 0;
`

const InputSelectCol = styled.div`
  flex: 0 0 7rem;
`

const BarCol = styled.div`
  flex: 1;
`

const Row = styled.div`
  display: flex;
`

const Items = styled.div`
  display: flex;
`

const Param = ({ title, nodeId, modifierIds, lfoOptionIds }) => (
  <Wrapper>
    <Row>
      {title}
      <BarCol>
        <ParamBar nodeId={nodeId} />
      </BarCol>
      <InputSelectCol>
        <ParamInputSelect nodeId={nodeId} />
      </InputSelectCol>
    </Row>

    <Items>
      {lfoOptionIds.map((id) => (
        <Select nodeId={id} key={id} />
      ))}
    </Items>

    <Items>
      {modifierIds.map((id) => (
        <Modifier nodeId={id} key={id} />
      ))}
    </Items>
  </Wrapper>
)

Param.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  modifierIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  lfoOptionIds: PropTypes.arrayOf(
    PropTypes.string
  )
}

export default Param
