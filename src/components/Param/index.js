import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'
import InputLink from '../../containers/InputLink'
import Node from '../Node'
import OpenButton from '../OpenButton'
import InputLinkTags from '../InputLinkTags'
import styled from 'styled-components'

const Wrapper = styled(Node)`
  margin: 0 0 0.5rem;
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
  align-items: center;
  padding: 0.5rem 0.25rem 0.5rem 0.5rem;
`
const Title = styled.div`
  flex: 0 0 8rem;
  text-align: right;
  padding-right: 1rem;
`

const Tags = styled(InputLinkTags)`
  padding-left: 8rem;
`

const Info = styled(Row)`
  margin-top: 0.5rem;
`

const Param = ({
  title, nodeId, inputLinkIds, infoText, isOpen, onOpenClick, isLearningMidi
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
      <Info align='center'>
        <Tags ids={inputLinkIds} />
        {isLearningMidi && 'Learning MIDI...'}
      </Info>
    </Top>
    {isOpen &&
      <Bottom>
        {inputLinkIds.map(id => (
          <InputLink id={id} key={id} />
        ))}
      </Bottom>
    }
  </Wrapper>
)

Param.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  infoText: PropTypes.string,
  inputLinkIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  isOpen: PropTypes.bool,
  onOpenClick: PropTypes.func.isRequired,
  isLearningMidi: PropTypes.bool
}

export default Param
