import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../utils/theme'
import useUiEventListener from '../../utils/customReactHooks/useUiEventListener'
import { useStore } from 'react-redux'

const Button = styled.div`
    height: 17px;
    border: 2px solid black;
    border-radius: 5px;
    background: ${props => props.theme === 'panel' ? theme.bgColorDark3 : theme.bgColorDark2};
    cursor: pointer;

    &.on {
        background: ${theme.actionColor1}
    }
`

const ParamCheckbox = ({ onClick, nodeId }) => {
  const store = useStore()
  const [value, setValue] = useState()

  useUiEventListener('slow-tick', () => {
    const newValue = store.getState().nodes[nodeId].value
    if (value !== newValue) setValue(newValue)
  })

  return (
    <Button onMouseDown={() => onClick(!value)} className={value === true && 'on'} />
  )
}

ParamCheckbox.propTypes = {
  onClick: PropTypes.func.isRequired,
  nodeId: PropTypes.string.isRequired,
}

export default ParamCheckbox
