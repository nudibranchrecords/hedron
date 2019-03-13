import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

import inputIcon from '../../assets/icons/input.icon.txt'
import macroIcon from '../../assets/icons/macro.icon.txt'
import IconComponent from '../Icon'

const Wrapper = styled.div`
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

const Icon = styled(IconComponent)`
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.1rem;
`

const IconInfo = styled.div`
  display: flex;
  margin-left: auto;
  flex-direction: ${props => props.size === 'compact' ? 'column' : 'row'};

  > span {
    display: flex;
    margin-left: ${props => props.size === 'compact' ? '0' : '0.3rem'};
  }
`

const NodeInputIcons = ({
  onClick, inputLinkTitle, numInputs, numMacros, size,
}) => (
  <Wrapper onClick={onClick}>
    {inputLinkTitle && size !== 'compact' && <span><Icon glyph={inputIcon} />{inputLinkTitle}</span>}
    <IconInfo size={size}>
      {numInputs !== undefined && (<span><Icon glyph={inputIcon} />{numInputs}</span>)}
      {numMacros !== undefined && (<span><Icon glyph={macroIcon} />{numMacros}</span>)}
    </IconInfo>
  </Wrapper>
)

NodeInputIcons.propTypes = {
  onClick: PropTypes.func,
  numInputs: PropTypes.number,
  numMacros: PropTypes.number,
  inputLinkTitle: PropTypes.string,
  size: PropTypes.string,
}

export default NodeInputIcons
