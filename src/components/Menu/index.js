// Having to use weird ref way of setting non standard attribute
// Better way may be possible in future
// https://github.com/facebook/react/issues/140

import React from 'react'

const Menu = ({ onFileChange, onSaveClick, onLoadClick }) => {
  return (
    <div>
      <input onChange={onFileChange} type='file'
        ref={node => node && node.setAttribute('nwsaveas', '')}
        accept='.json'
      />
      <input onChange={onFileChange} type='file' accept='.json' />
      <button onClick={onSaveClick}>Save</button>
      <button onClick={onLoadClick}>Load</button>
    </div>
  )
}

Menu.propTypes = {
  onFileChange: React.PropTypes.func.isRequired,
  onSaveClick: React.PropTypes.func.isRequired,
  onLoadClick: React.PropTypes.func.isRequired
}

export default Menu
