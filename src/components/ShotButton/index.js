import React from 'react'

const Shot = ({ onClick }) => (
  <button onClick={onClick}>Fire</button>
)

Shot.propTypes = {
  onClick: React.PropTypes.func.isRequired
}

export default Shot
