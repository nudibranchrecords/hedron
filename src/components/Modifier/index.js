import React from 'react'
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
  title: React.PropTypes.string.isRequired,
  nodeId: React.PropTypes.string.isRequired
}

export default Modifier
