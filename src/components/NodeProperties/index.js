import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Revealer from '../../components/Revealer'
import ParamRange from '../../containers/ParamRange'
import Control from '../../containers/Control'
import InputLinkUI from '../../containers/InputLinkUI'
import theme from '../../utils/theme'
import MacroProperties from '../../containers/MacroProperties'

const Top = styled.div`
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: ${theme.lineColor1} 1px dashed;
`
const Bar = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-size: 0.6rem;
  align-items: center;

  > div {
    width: 30%;
  }

  > span {
    margin-right: 0.5rem;
  }
`

const NodeProperties = ({ nodeId, type, advancedIsOpen, onAdvancedClick, displayValue }) => (
  <div>
    <Top>
      { displayValue && <Bar><span>Value:</span><div><Control nodeId={nodeId} theme='panel' /></div></Bar>}
      <InputLinkUI nodeId={nodeId} />
    </Top>
    {
      type === 'macro'
      ? <MacroProperties macroId={nodeId} />
      : <Revealer title='Advanced' isOpen={advancedIsOpen} onHeaderClick={onAdvancedClick}>
        <ParamRange nodeId={nodeId} />
      </Revealer>
    }
  </div>
)

NodeProperties.propTypes = {
  nodeId: PropTypes.string.isRequired,
  advancedIsOpen: PropTypes.bool,
  onAdvancedClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  displayValue: PropTypes.bool,
}

export default NodeProperties
