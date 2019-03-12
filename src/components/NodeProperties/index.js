import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Revealer from '../../components/Revealer'
import ParamRange from '../../containers/ParamRange'
import InputLinkUI from '../../containers/InputLinkUI'
import theme from '../../utils/theme'
import MacroProperties from '../../containers/MacroProperties'

const Top = styled.div`
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: ${theme.lineColor1} 1px dashed;
`

const NodeProperties = ({ nodeId, type, advancedIsOpen, onAdvancedClick }) => (
  <div>
    <Top>
      <InputLinkUI nodeId={nodeId} />
    </Top>
    <Revealer title='Advanced' isOpen={advancedIsOpen} onHeaderClick={onAdvancedClick}>
      <ParamRange nodeId={nodeId} />
    </Revealer>
    { type === 'macro' && <MacroProperties nodeId={nodeId} /> }
  </div>
)

NodeProperties.propTypes = {
  nodeId: PropTypes.string.isRequired,
  advancedIsOpen: PropTypes.bool,
  onAdvancedClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

export default NodeProperties
