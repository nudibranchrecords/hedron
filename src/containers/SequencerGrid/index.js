import { connect } from 'react-redux'
import SequencerGrid from '../../components/SequencerGrid'
import getNode from '../../selectors/getNode'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => ({
  items: getNode(state, ownProps.nodeId).value,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onStepClick: (steps, index) => {
    // Toggle whatever index was clicked
    steps = steps.slice(0)
    steps[index] = steps[index] === 1 ? 0 : 1
    dispatch(nodeValueUpdate(ownProps.nodeId, steps, {
      dontMutate: true,
    }))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.nodes === prev.nodes,
  }
)(SequencerGrid)
