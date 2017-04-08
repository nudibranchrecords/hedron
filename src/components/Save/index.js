// Having to use weird ref way of setting non standard attribute
// Better way may be possible in future
// https://github.com/facebook/react/issues/140

import React from 'react'

const Save = ({ onFileChange, onButtonClick }) => {
  return (
    <div>
      <input onChange={onFileChange} type='file'
        ref={node => node && node.setAttribute('nwsaveas', '')}
        accept='.json'
      />
      <button onClick={onButtonClick}>Save</button>
    </div>
  )
}

Save.propTypes = {
  onFileChange: React.PropTypes.func.isRequired,
  onButtonClick: React.PropTypes.func.isRequired
}

export default Save
