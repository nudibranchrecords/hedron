import React from 'react'
import PropTypes from 'prop-types'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Title = styled.h3`
  font-size: ${props => props.size === 'small' ? '0.8rem' : '1rem'};
`
const Item = styled.div`
  flex: ${props => props.size === 'small' ? '1' : '0 0 25%'};
  width: ${props => props.size === 'small' ? '100%' : '25%'};
  font-size: 0.8rem;
  padding-right: 0.25rem;
`
const InputLink = ({
  modifierIds, lfoOptionIds, title, size
}) => (
  <div>
    <Title size={size}>{title}</Title>
    <Wrapper>
      {lfoOptionIds && lfoOptionIds.map((id) => (
        <Item key={id} size={size}>
          <Select nodeId={id} />
        </Item>
        ))}
      {modifierIds && modifierIds.map((id) => (
        <Item key={id} size={size}>
          <Modifier nodeId={id} />
        </Item>
        ))}
    </Wrapper>
  </div>
)

InputLink.propTypes = {
  title: PropTypes.string,
  modifierIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  lfoOptionIds: PropTypes.arrayOf(
    PropTypes.string
  ),
  size: PropTypes.string
}

export default InputLink
