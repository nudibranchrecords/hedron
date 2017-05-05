import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 1px solid #292929;
  border-radius: 3px;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0
`

const InputSelectCol = styled.div`
  flex: 0 0 5rem;
`

const BarCol = styled.div`
  flex: 1;
  padding-right: 1rem;
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const Info = styled.div`
  margin-left: 8rem;
  text-transform: uppercase;
  font-size: 0.7rem;
`
const Items = styled.div`
  display: flex;
`

const Title = styled.div`
  flex: 0 0 8rem;
  text-align: right;
  padding-right: 1rem;
`

const Param = ({ title, nodeId, modifierIds, lfoOptionIds, infoText }) => (
  <Wrapper>
    <Row>
      <Title>{title}</Title>
      <BarCol>
        <ParamBar nodeId={nodeId} />
      </BarCol>
      <InputSelectCol>
        <ParamInputSelect nodeId={nodeId} />
      </InputSelectCol>
    </Row>
    <Info>{infoText}</Info>
    {/*
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
    */}
  </Wrapper>
)

Param.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  infoText: PropTypes.string,
  modifierIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  lfoOptionIds: PropTypes.arrayOf(
    PropTypes.string
  )
}

export default Param
