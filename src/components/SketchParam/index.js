import React from 'react'
import PropTypes from 'prop-types'
import Param from '../../containers/Param'
import InputLink from '../../containers/InputLink'
import ParamInputSelect from '../../containers/ParamInputSelect'

const SketchParam = (props) => (
  <Param {...props}>
    <ParamInputSelect nodeId={props.nodeId} />
    {props.inputLinkIds.map(id => (
      <InputLink id={id} key={id} />
    ))}
  </Param>
)

SketchParam.propTypes = {
  inputLinkIds: PropTypes.arrayOf(
    PropTypes.string
  )
}

export default SketchParam
