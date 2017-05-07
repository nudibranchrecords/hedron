import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'
import Modifier from '../../containers/Modifier'
import InfoText from '../InfoText'
import Node from '../Node'
import OpenButton from '../OpenButton'
import Select from '../../containers/Select'
import styled from 'styled-components'

const Wrapper = styled(Node)`
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
  border-top: 1px dashed #212121;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.5rem 0.25rem 0.5rem 0.5rem;
`

const Item = styled.div`
  flex: 0 0 25%;
  width: 25%;
  font-size: 0.8rem;
  padding-right: 0.25rem;
`
const Title = styled.div`
  flex: 0 0 8rem;
  text-align: right;
  padding-right: 1rem;
`

const Info = styled(InfoText)`
  padding-left: 8rem;
`

const Param = ({
  title, nodeId, modifierIds, lfoOptionIds, infoText, isOpen, onOpenClick
}) => (
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
        <OpenButton onClick={onOpenClick} isOpen={isOpen} />
      </Row>
      <Info>{infoText}</Info>
    </Top>
    {isOpen &&
      <Bottom>
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
      </Bottom>
    }
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
  ),
  isOpen: PropTypes.bool,
  onOpenClick: PropTypes.func.isRequired
}

export default Param
