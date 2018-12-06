import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.li`
  border: 1px solid;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  flex: 1;
  margin-right: 0.25rem;
  text-align: center;
  cursor: pointer;
  background: ${props => props.isActive ? '#da5782' : 'transparent'};
  border-color: ${props => props.isActive ? '#da5782' : '#aaa'};

  &:hover {
    border-color: white;
  }

  &:last-child {
    margin-right: 0;
  }
`

const BankSelectItem = ({ index, onClick, isActive }) => (
  <Wrapper onClick={onClick} isActive={isActive}>
    {index + 1}
  </Wrapper>
)

BankSelectItem.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
}

export default BankSelectItem
