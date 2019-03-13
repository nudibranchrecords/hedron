import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import NodeSelect from '../../containers/NodeSelect'
import NodeInputIcons from '../../containers/NodeInputIcons'
import styled from 'styled-components'
import { PanelContext } from '../../context'
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

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Inner = styled.div`
  margin-bottom: 0.25rem;
  width: 50%;
`

const Title = styled.div`
  width: 50%;
  border-bottom: 1px dotted ${theme.bgColorDark3};
  display: flex;
  align-items: center;
  height: 16px;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  font-size: 0.5rem;
  z-index: 1;
`

const Select = styled(NodeSelect)`
  flex: 1;
`

const Node = ({ title, nodeId, isOpen, onParamBarClick, type, panelId }) => (
  <PanelContext.Consumer>
    {panelIdCtx => {
      panelId = panelId || panelIdCtx
      const theme = panelId !== undefined ? 'panel' : 'sketch'
      let inner

      switch (type) {
        case 'select':
          inner = (
            <Select nodeId={nodeId} />
          )
          break
        case 'slider':
        default:
          inner = (
            <ParamBar
              nodeId={nodeId}
              onMouseDown={onParamBarClick}
              type={type}
              theme={theme}
            />
          )
      }

      return (
        <Wrapper isOpen={isOpen} theme={theme}>
          <Main>
            <Title>{title}</Title>
            <Inner>
              {inner}
            </Inner>
          </Main>
          <NodeInputIcons nodeId={nodeId} panelId={panelId} />
        </Wrapper>
      )
    }}
  </PanelContext.Consumer>
)

Node.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onParamBarClick: PropTypes.func,
  type: PropTypes.string,
  panelId: PropTypes.string,
}

export default Node
