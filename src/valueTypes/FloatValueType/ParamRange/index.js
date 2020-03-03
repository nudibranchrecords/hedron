import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import RangeComponent from './component'
import { nodeUpdate, nodeResetRange } from '../../../store/nodes/actions'
import getNode from '../../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  return {
    initialValues: {
      min: node.min,
      max: node.max,
    },
    form: ownProps.nodeId + 'range',
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (obj) => {
      dispatch(nodeUpdate(ownProps.nodeId, obj))
    },
    onResetClick: () => {
      dispatch(nodeResetRange(ownProps.nodeId))
    },
  }
}

const ParamRange = reduxForm({
  enableReinitialize: true,
})(RangeComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParamRange)
