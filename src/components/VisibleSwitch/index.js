import React from 'react'
import PropTypes from 'prop-types'

const VisibleSwitch = (props) => {
  const Component = props.component

  return (
    <div>
      {props.isVisible &&
        <Component {...props} />
      }
    </div>
  )
}

VisibleSwitch.propTypes = {
  component: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
}

export default VisibleSwitch
