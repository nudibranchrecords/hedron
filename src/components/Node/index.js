import React from 'react'
import PropTypes from 'prop-types'
import Control from '../../containers/Control'
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

  ${props => {
    switch (props.theme) {
      case 'panel':
        return `border-color: ${theme.bgColorDark3};`
      case 'light':
        return `border-color: ${theme.lineColor2};`
    }
  }}
  

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
  margin-right: 0.25rem;
  font-size: 0.5rem;
  z-index: 1;
  overflow: hidden;

  ${props => {
    switch (props.theme) {
      case 'light':
        return `border-color: ${theme.lineColor2};`
    }
  }}
`

const Node = ({ title, nodeId, isOpen, onParamBarClick, type, panelId, theme }) => (
  <Wrapper isOpen={isOpen} theme={theme}>
    <Main>
      <Title theme={theme}>{title}</Title>
      <Inner>
        <Control nodeId={nodeId} onParamBarClick={onParamBarClick} theme={theme} />
      </Inner>
    </Main>
    <NodeInputIcons nodeId={nodeId} panelId={panelId} />
  </Wrapper>
)

Node.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onParamBarClick: PropTypes.func,
  type: PropTypes.string,
  panelId: PropTypes.string,
  theme: PropTypes.string,
}

export default Node
