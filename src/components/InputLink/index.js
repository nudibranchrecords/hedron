import React from 'react'
import PropTypes from 'prop-types'
import Modifier from '../../containers/Modifier'
import Select from '../../containers/Select'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Item = styled.div`
  flex: 0 0 25%;
  width: 25%;
  font-size: 0.8rem;
  padding-right: 0.25rem;
`
const InputLink = ({
  modifierIds, lfoOptionIds, title
}) => (
  <div>
    <h3>{title}</h3>
    <Wrapper>
      {lfoOptionIds && lfoOptionIds.map((id) => (
        <Item key={id}>
          <Select nodeId={id} />
        </Item>
        ))}
      {modifierIds && modifierIds.map((id) => (
        <Item key={id}>
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
  )
}

export default InputLink
