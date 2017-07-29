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
  onFileSaveChange, onFileLoadChange, onSaveClick,
  filePath, onSendOutputChange, clockIsGenerated, onClockToggleClick,
  displayOptions
}) => {
  let saveAsInput
  let loadInput

  return (
    <Row>
      <Button onClick={onSaveClick}>Save</Button>
      <Button onClick={() => saveAsInput.click()}>Save As</Button>
      <Button onClick={() => loadInput.click()}>Load</Button>
      <FilePath>{filePath}</FilePath>

      <input
        onChange={onFileSaveChange}
        type='file'
        ref={
              node => {
                node && node.setAttribute('nwsaveas', '')
                saveAsInput = node
              }
          }
        accept='.json'
        style={{ display: 'none' }}
        />
      <input
        onChange={onFileLoadChange}
        type='file'
        ref={node => { loadInput = node }}
        accept='.json'
        style={{ display: 'none' }} />

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
  onFileSaveChange: PropTypes.func.isRequired,
  onFileLoadChange: PropTypes.func.isRequired,
  onSendOutputChange: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onClockToggleClick: PropTypes.func.isRequired,
  clockIsGenerated: PropTypes.bool,
  displayOptions: PropTypes.array.isRequired
}

export default Menu
