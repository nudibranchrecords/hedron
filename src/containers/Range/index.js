import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import RangeComponent from '../../components/Range'
import { nodeRangeUpdate } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  return {
    min: node.min,
    max: node.max
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch(nodeRangeUpdate(ownProps.nodeId, value))
    }
  }
}

const Range = reduxForm({
  form: 'range'
})(RangeComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Range)
