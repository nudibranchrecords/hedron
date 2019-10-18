import { connect } from 'react-redux'
import Control from '../../components/Control'
import getNode from '../../selectors/getNode'

const getControlType = node => {
  const valueTypeToControl = {
    float: 'slider',
    boolean: 'checkbox',
  }

  switch (node.type) {
    case 'param':
    case 'macroTargetParamLink':
      return valueTypeToControl[node.valueType]
    default:
      return node.type
  }
}

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)

  return {
    type: getControlType(node),
    onChangeAction: node.onChangeAction,
  }
}

const ControlContainer = connect(
  mapStateToProps,
)(Control)

export default ControlContainer
