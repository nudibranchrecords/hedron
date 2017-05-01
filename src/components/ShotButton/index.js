import React from 'react'
import PropTypes from 'prop-types'

const Shot = ({ onClick }) => (
  <button onClick={onClick}>Fire</button>
)

Shot.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Shot
