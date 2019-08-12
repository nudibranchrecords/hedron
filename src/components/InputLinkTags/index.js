import React from 'react'
import PropTypes from 'prop-types'
import InputLinkTag from '../../containers/InputLinkTag'
import styled from 'styled-components'

const Items = styled.ul`
  display: flex;
  flex-wrap: wrap;
`
const Item = styled.li`
  margin-right: 0.5rem;
`

const InputLinkTags = ({ ids }) => (
  <div>
    <Items>
      {ids && ids.map(id => (
        <Item key={id}>
          <InputLinkTag id={id} />
        </Item>
      ))}
    </Items>
  </div>
)

InputLinkTags.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string),
}

export default InputLinkTags
