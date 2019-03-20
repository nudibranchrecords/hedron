import { connect } from 'react-redux'
import Control from '../../components/Control'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const type = node.type || 'param'

  return {
    type,
    onChangeAction: node.onChangeAction,
  }
}

const ControlContainer = connect(
  mapStateToProps,
)(Control)

export default ControlContainer
