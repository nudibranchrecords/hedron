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
  color: ${props => props.isSelected ? theme.textColorLight1 : '#111'};
  background: ${props => props.isSelected ? theme.bgColorLight1 : 'transparent'};
  border-color: ${props => props.isSelected ? theme.lineColor2 : theme.lineColor1};
  cursor: pointer;

  span {
    margin-left: auto;
    margin-right: 0.5rem;
  }

  &:hover {
    color: white;
  }
`

const NodeTabItem = ({ title, isSelected, onClick }) => (
  <Wrapper isSelected={isSelected} onClick={onClick}>
    {title}
  </Wrapper>
)

NodeTabItem.propTypes = {
  title: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

export default NodeTabItem
