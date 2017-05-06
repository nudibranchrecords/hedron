import React from 'react'
import styled from 'styled-components'
import Icon from '../Icon'
import downIcon from '../../assets/icons/down.svg'

const Button = styled(Icon)`
  cursor: pointer;
  transform: rotate(${props => props.isOpen ? '0deg' : '-90deg'});

  &:hover {
    fill: #DA5782
  }
`

const OpenButton = (props) => (
  <Button glyph={downIcon} {...props} />
)

export default OpenButton
