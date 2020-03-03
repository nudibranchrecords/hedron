import { connect } from 'react-redux'
import ValueBar from './component'
import { nodeValueUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import getIsEditing from '../../selectors/getIsEditing'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const type = node.type

  return {
    type,
    formIsVisible: getIsEditing(state, ownProps.nodeId, 'paramValue'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value))
    },
    onDoubleClick: () => {
      dispatch(uiEditingOpen('paramValue', ownProps.nodeId))
    },
  }
}

const ParamBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValueBar)

export default ParamBarContainer
