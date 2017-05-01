// Having to use weird ref way of setting non standard attribute
// Better way may be possible in future
// https://github.com/facebook/react/issues/140

import React from 'react'
import PropTypes from 'prop-types'

const Menu = ({
  onFileSaveChange, onFileLoadChange, onSaveClick, filePath, onSendOutputClick
}) => {
  let saveAsInput
  let loadInput

  return (
    <div>
      <button onClick={onSaveClick}>Save</button>
      <button onClick={() => saveAsInput.click()}>Save As</button>
      <button onClick={() => loadInput.click()}>Load</button>
      <span>{filePath}</span>

      <button onClick={onSendOutputClick}>Send to display</button>

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
    </div>
  )
}

Menu.propTypes = {
  filePath: PropTypes.string,
  onFileSaveChange: PropTypes.func.isRequired,
  onFileLoadChange: PropTypes.func.isRequired,
  onSendOutputClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired
}

export default Menu
