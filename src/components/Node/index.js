import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import styled from 'styled-components'
import inputIcon from '../../assets/icons/input.icon.txt'
import macroIcon from '../../assets/icons/macro.icon.txt'
import IconComponent from '../Icon'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  border: 1px solid ${theme.lineColor1};
  border-radius: 3px;
  color: ${theme.textColorLight1};
  fill: ${theme.textColorLight1};
  padding: 0.25rem;
  display: flex;
  flex-direction: column;

  ${props => props.theme === 'panel' && `
    border-color: ${theme.bgColorDark3};
  `}

  ${props => props.isOpen && `
    border-color: white;
  `}
`

const BarCol = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.25rem;
`

const Title = styled.div`
  color: ${theme.textColorLight1};
  text-transform: uppercase;
  height: 1rem;
  font-size: 0.55rem;
  z-index: 1;
  position: absolute;
  top: 0.25rem;
  left: 0.2rem;
  width: 1000px;
  pointer-events: none;
`

const Icon = styled(IconComponent)`
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.1rem;
`
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.5rem;
  cursor: pointer;
  text-transform: uppercase;

  > span {
    display: flex;
  }

  &:hover {
    color: ${theme.actionColor1};
    fill: ${theme.actionColor1};
  }
`

const IconInfo = styled.div`
  display: flex;
  margin-left: auto;

  > span {
    display: flex;
    margin-left: 0.3rem;
  }
`

const Param = ({ title, nodeId, isOpen, onOpenClick, onParamBarClick, numInputs,
  numMacros, inputLinkTitle, type, theme }) => (
    <Wrapper isOpen={isOpen} theme={theme}>
      <BarCol>
        <Title>{title}</Title>
        <ParamBar
          nodeId={nodeId}
          onMouseDown={onParamBarClick}
          type={type}
          theme={theme}
        />
      </BarCol>

      <Info onClick={onOpenClick}>
        {inputLinkTitle && <span><Icon glyph={inputIcon} />{inputLinkTitle}</span>}
        <IconInfo>
          {numInputs !== undefined && (<span><Icon glyph={inputIcon} />{numInputs}</span>)}
          {numMacros !== undefined && (<span><Icon glyph={macroIcon} />{numMacros}</span>)}
        </IconInfo>
      </Info>
    </Wrapper>
  )

Param.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onOpenClick: PropTypes.func.isRequired,
  onParamBarClick: PropTypes.func,
  numInputs: PropTypes.number,
  numMacros: PropTypes.number,
  inputLinkTitle: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.string,
}

export default Param
