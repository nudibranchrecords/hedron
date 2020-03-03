import { connect } from 'react-redux'
import Select from '../../containers/Select'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  const currentOpt = select.options.find(opt => opt.value === select.value)
  return {
    id: `node_${ownProps.nodeId}`,
    _value: currentOpt,
    options: select.options,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    _onChange: option => {
      dispatch(nodeValueUpdate(ownProps.nodeId, option.value, {
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
  (stateProps, dispatchProps, ownProps) => {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      ...{
        // This structure is needed so the component is compatible
        // with redux-form (redux-form not actually being used with this component though)
        input: {
          onChange: dispatchProps._onChange,
          value: stateProps._value,
        },
      },
    }
  },
  {
    // We need to always be updating the select element because node values
    // dont mutate state and so changes aren't picked up.
    // TODO: Don't have these update constantly!
    areStatesEqual: () => false,
  }
)(Select)
