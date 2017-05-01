import React from 'react'
import PropTypes from 'prop-types'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'

const Modifier = ({ title, nodeId }) => (
  <div>
    {title}
    <br />
    <ParamBar nodeId={nodeId} />
    <ParamInputSelect nodeId={nodeId} />
  </div>
)

Modifier.propTypes = {
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired
}

export default Modifier
