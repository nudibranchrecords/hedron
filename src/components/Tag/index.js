import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  text-transform: uppercase;
  font-size: 0.5rem;
  color: #999;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
`

const Text = styled.span`
  display: block;
  padding: 0.1rem 0 0.1rem 0.2rem;
`

const Close = styled.span`
  display: block;
  margin-left: 0.1rem;
  padding: 0.1rem 0.2rem;
  cursor: pointer;

  &:hover {
    color: #da5782;
  }
`

const Tag = ({ title, onCloseClick }) => (
  <Wrapper>
    <Text>{title}</Text><Close onClick={onCloseClick}>&times;</Close>
  </Wrapper>
)

Tag.propTypes = {
  title: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func.isRequired,
}

export default Tag
