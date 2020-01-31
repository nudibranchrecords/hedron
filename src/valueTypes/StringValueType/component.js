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
  const [value, setValue] = useState('')

  useUiEventListener('slow-tick', () => {
    const newValue = store.getState().nodes[nodeId].value
    // Update text box often from external changes (e.g. shots or macros)
    if (value !== newValue) setValue(newValue)
  })

  return (
    <TextField
      value={value}
      onChange={(event) => {
        onChange(event.target.value)
        // Update text box immediately on user input
        setValue(event.target.value)
      }}
    />
  )
}

ParamString.propTypes = {
  onChange: PropTypes.func.isRequired,
  nodeId: PropTypes.string.isRequired,
}

export default ParamString
