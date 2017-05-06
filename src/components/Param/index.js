import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'
import Modifier from '../../containers/Modifier'
import InfoText from '../InfoText'
import styled from 'styled-components'
import downIcon from '../../assets/icons/down.svg'
import Icon from '../Icon'

const Wrapper = styled.div`
  border: 1px solid #292929;
  border-radius: 3px;

  margin: 0 0 0.5rem 0
`

const InputSelectCol = styled.div`
  flex: 0 0 5rem;
  padding-right: 1rem;
`

const BarCol = styled.div`
  flex: 1;
  padding-right: 1rem;
`

const Top = styled.div`
  padding: 0.5rem;
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const Bottom = styled.div`
  border-top: 1px dashed #292929;
  display: flex;
  align-items: center;
  padding: 0.5rem;
`

const Item = styled.div`
  flex: 0 0 25%;
  font-size: 0.8rem;
  background: #434343;
  padding: 0.25rem;
  margin-right: 0.25rem;
`
const Title = styled.div`
  flex: 0 0 8rem;
  text-align: right;
  padding-right: 1rem;
`

const Info = styled(InfoText)`
  padding-left: 8rem;
`

const Param = ({ title, nodeId, modifierIds, lfoOptionIds, infoText }) => (
  <Wrapper>
    <Top>
      <Row>
        <Title>{title}</Title>
        <BarCol>
          <ParamBar nodeId={nodeId} />
        </BarCol>
        <InputSelectCol>
          <ParamInputSelect nodeId={nodeId} />
        </InputSelectCol>
        <Icon glyph={downIcon} />
      </Row>
      <Info>{infoText}</Info>
    </Top>

    {/*
    <Items>
      {lfoOptionIds.map((id) => (
        <Select nodeId={id} key={id} />
      ))}
    </Items>
  */}

    <Bottom>
      {modifierIds.map((id) => (
        <Item>
          <Modifier nodeId={id} key={id} />
        </Item>
      ))}
    </Bottom>
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
