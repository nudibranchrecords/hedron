import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import useUiEventListener from '../../utils/customReactHooks/useUiEventListener'
import { useStore } from 'react-redux'

const TextField = styled.input`
    height: 17px;
    border: 2px solid black;
    border-radius: 5px;
    background: ${props => props.theme === 'panel' ? theme.bgColorDark3 : theme.bgColorDark2};
    color:${theme.textColorLight1};
    cursor: text;
    width: 100%;
`

const ParamString = ({ onChange, nodeId }) => {
  const store = useStore()
  const [value, setValue] = useState({ value: '' })

  useUiEventListener('slow-tick', () => {
    const newValue = store.getState().nodes[nodeId].value
    if (value !== newValue) setValue(newValue)
  })
  return (
    <TextField
      value={value} // This seems to not handle multiple fast keypresses, only updating with one of the keys
      onChange={(event) => {
        onChange(event.target.value)
      }}
    />
  )
}

ParamString.propTypes = {
  onChange: PropTypes.func.isRequired,
  nodeId: PropTypes.string.isRequired,
}

export default ParamString
