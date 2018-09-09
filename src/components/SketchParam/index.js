import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Revealer from '../../components/Revealer'
import Param from '../../containers/Param'
import ParamRange from '../../containers/ParamRange'
import InputLinkUI from '../../containers/InputLinkUI'
import theme from '../../utils/theme'

const Top = styled.div`
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: ${theme.lineColor1} 1px dashed;
`

const SketchParam = ({ nodeId, sketchId, advancedIsOpen, onAdvancedClick }) => (
  <Param nodeId={nodeId} sketchId={sketchId}>
    <Top>
      <InputLinkUI nodeId={nodeId} />
    </Top>
    <Revealer title='Advanced' isOpen={advancedIsOpen} onHeaderClick={onAdvancedClick}>
      <ParamRange nodeId={nodeId} />
    </Revealer>
  </Param>
)

SketchParam.propTypes = {
  nodeId: PropTypes.string.isRequired,
  sketchId: PropTypes.string.isRequired,
  advancedIsOpen: PropTypes.bool,
  onAdvancedClick: PropTypes.func.isRequired
}

export default SketchParam
