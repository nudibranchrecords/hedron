import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import NodeInputIcons from '../../containers/NodeInputIcons'
import styled from 'styled-components'

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

const Node = ({ title, nodeId, isOpen, onParamBarClick, type, theme, panelId }) => (
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
    <NodeInputIcons nodeId={nodeId} panelId={panelId} />
  </Wrapper>
)

Node.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onParamBarClick: PropTypes.func,
  type: PropTypes.string,
  theme: PropTypes.string,
  panelId: PropTypes.string,
}

export default Node
