import { connect } from 'react-redux'
import Control from '../../components/Control'
import getNode from '../../selectors/getNode'
import { getType } from '../../valueTypes'
import ParamBar from '../../valueTypes/FloatValueType/container'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const valueType = getType(node.valueType)
  let Component

  if (valueType) {
    Component = valueType.Component
  } else {
    Component = ParamBar
  }

  return {
    Component,
    onChangeAction: node.onChangeAction,
    valueType: node.valueType,
  }
}

const ControlContainer = connect(
  mapStateToProps,
)(Control)

export default ControlContainer
