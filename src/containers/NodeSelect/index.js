import { connect } from 'react-redux'
import Select from '../Select'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  const currentOpt = select.options.find(opt => opt.value === select.value)
  return {
    id: `node_${ownProps.nodeId}`,
    input: {
      value: currentOpt,
    },
    options: select.options,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    input: {
      onChange: option => {
        dispatch(nodeValueUpdate(ownProps.nodeId, option.value, {
          dontMutate: true,
        }))

        if (ownProps.onChangeAction) {
          dispatch(ownProps.onChangeAction)
        }
      },
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    // This structure is needed so the component is compatible
    // with redux-form (redux-form not actually being used with this component though)
    ...{
      input: {
        value: stateProps.input.value,
        onChange: dispatchProps.input.onChange,
      },
    },
  }),
)(Select)
