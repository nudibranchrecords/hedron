import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'
import Node from '../Node'
import OpenButton from '../OpenButton'
import NodeInputInfo from '../../containers/NodeInputInfo'
import styled from 'styled-components'
import inputIcon from '../../assets/icons/input.icon.txt'
import macroIcon from '../../assets/icons/macro.icon.txt'
import IconComponent from '../Icon'
import theme from '../../utils/theme'

const Wrapper = styled(Node)`
  width: 100%;
  color: ${theme.textColorLight1};
`

const BarCol = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.25rem;
`

const Top = styled.div`
  padding: 0.5rem;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
`

const Bottom = styled.div`
  border-top: 1px dashed #212121;
  align-items: center;
  padding: 0.5rem 0.25rem 0.5rem 0.5rem;
`

const Title = styled.div`
  color: ${theme.textColorLight1};
  text-transform: uppercase;
  height: 1rem;
  font-size: 0.6rem;
  z-index: 1;
  position: absolute;
  top: 0.1rem;
  left: 0.2rem;
  width: 1000px;
  pointer-events: none;
`

const Icon = styled(IconComponent)`
  fill: ${theme.textColorLight1};
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.1rem;
`
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;

  > span {
    display: flex;
  }
`

const IconInfo = styled.div`
  display: flex;

  > span {
    display: flex;
    margin-left: 0.3rem;
  }
`
const Param = ({
  title, nodeId, inputLinkIds, infoText, isOpen, onOpenClick, children, value
}) => (
  <Wrapper>
    <Top>
      <Row>
        <BarCol>
          <Title>{title}</Title>
          <ParamBar nodeId={nodeId} />
        </BarCol>
        <Info>
          <span><Icon glyph={inputIcon} />Audio Low</span>
          <IconInfo>
            <span><Icon glyph={inputIcon} />1</span>
            <span><Icon glyph={macroIcon} />0</span>
          </IconInfo>
        </Info>
      </Row>
    </Top>
    {isOpen &&
      <Bottom>
        {children}
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
  children: PropTypes.node,
  value: PropTypes.string
}

export default Param
