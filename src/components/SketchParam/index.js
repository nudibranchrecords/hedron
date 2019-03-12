import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Revealer from '../../containers/AuxRevealer'
import Node from '../../containers/Node'
import ParamRange from '../../containers/ParamRange'
import InputLinkUI from '../../containers/InputLinkUI'
import theme from '../../utils/theme'

const Top = styled.div`
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: ${theme.lineColor1} 1px dashed;
`

const SketchParam = ({ nodeId, isHidden, auxRevealerId }) => (
  (!isHidden &&
  <Node nodeId={nodeId}>
    <Top>
      <InputLinkUI nodeId={nodeId} />
    </Top>
    <Revealer title='Advanced' auxId={auxRevealerId}>
      <ParamRange nodeId={nodeId} />
    </Revealer>
  </Node>
  )
)

SketchParam.propTypes = {
  nodeId: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
}

export default SketchParam
