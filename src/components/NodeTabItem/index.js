import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'

const Wrapper = styled.div`
  display: flex;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  border: 1px solid ${theme.lineColor1};
  color: ${props => props.isSelected ? 'white' : '#ddd'};

  background-color: ${props => {
    let color = props.isSelected ? theme.bgColorLight1 : 'transparent'
    color = props.isActive && props.isSelected ? theme.actionColor1 : color
    return color
  }};

  border-color: ${props => {
    let color = props.isActive ? theme.actionColor1 : theme.lineColor2
    color = props.isSelected ? 'white' : color
    return color
  }};
  cursor: pointer;

  span {
    margin-left: auto;
    margin-right: 0.5rem;
  }

  &:hover {
    color: white;
  }
`

const NodeTabItem = ({ title, isSelected, onClick, isActive }) => (
  <Wrapper isSelected={isSelected} isActive={isActive} onClick={onClick}>
    {title}
  </Wrapper>
)

NodeTabItem.propTypes = {
  title: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

export default NodeTabItem
