import { connect } from 'react-redux'
import Control from '../../components/Control'
import getNode from '../../selectors/getNode'
import { getType } from '../../valueTypes'
import NodeSelect from '../../containers/NodeSelect'
import ParamBar from '../../containers/ParamBar'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const valueType = getType(node.valueType)
  let Component

  if (valueType) {
    Component = valueType.Component
  } else if (node.type === 'select') {
    Component = NodeSelect
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
