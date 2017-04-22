import React from 'react'
import ParamBar from '../../containers/ParamBar'
import ParamInputSelect from '../../containers/ParamInputSelect'

const Modifier = ({ title, paramId }) => (
  <div>
    {title}
    <br />
    <ParamBar paramId={paramId} />
    <ParamInputSelect paramId={paramId} />
  </div>
)

Modifier.propTypes = {
  title: React.PropTypes.string.isRequired,
  paramId: React.PropTypes.string.isRequired
}

export default Modifier
