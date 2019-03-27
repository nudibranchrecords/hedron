import { connect } from 'react-redux'
import Select from '../../components/Select'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  return {
    value: select.value,
    options: select.options,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: event => {
      dispatch(nodeValueUpdate(ownProps.nodeId, event.target.value, {
        dontMutate: true,
      }))

      if (ownProps.onChangeAction) {
        dispatch(ownProps.onChangeAction)
      }
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: () => false,
  }
)(Select)
