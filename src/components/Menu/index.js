// Having to use weird ref way of setting non standard attribute
// Better way may be possible in future
// https://github.com/facebook/react/issues/140

import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import styled from 'styled-components'
import Row from '../Row'

const Right = styled.div`
  margin-left: auto;
  display: flex;
`

const FilePath = styled.span`
  font-size: 0.5rem;
`

const Menu = ({
  onSaveClick, onSaveAsClick, onLoadClick,
  filePath, saveIsDisabled, onSendOutputChange, clockIsGenerated, onClockToggleClick,
  displayOptions
}) => {
  return (
    <Row>
      <Button onClick={onSaveClick} disabled={saveIsDisabled}>Save</Button>
      <Button onClick={onSaveAsClick}>Save As</Button>
      <Button onClick={onLoadClick}>Load</Button>
      <FilePath>{filePath}</FilePath>

      <Row>
        {
              displayOptions.map((item, index) => (
                <Button key={index} onClick={() => onSendOutputChange(index)}>{item.label}</Button>
              ))
            }
      </Row>

      <Right>
        <Button onClick={onClockToggleClick}>
            Mock Clock is: {clockIsGenerated ? 'ON' : 'OFF'}
        </Button>
      </Right>
    </Row>

  )
}

Menu.propTypes = {
  filePath: PropTypes.string,
  onSaveClick: PropTypes.func.isRequired,
  onSaveAsClick: PropTypes.func.isRequired,
  onLoadClick: PropTypes.func.isRequired,
  onSendOutputChange: PropTypes.func.isRequired,
  onClockToggleClick: PropTypes.func.isRequired,
  clockIsGenerated: PropTypes.bool,
  displayOptions: PropTypes.array.isRequired,
  saveIsDisabled: PropTypes.bool
}

export default Menu
