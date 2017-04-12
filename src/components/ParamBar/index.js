import React from 'react'

const ParamBar = ({ value, onChange }) => {
  return (
    <div>
      {value}<br />
      <input type='range' value={value} min='0' max='1' step='0.001' onChange={onChange} />
    </div>
  )
}

ParamBar.propTypes = {
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default ParamBar
