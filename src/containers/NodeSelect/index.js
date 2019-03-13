import { connect } from 'react-redux'
import ReactSelect from 'react-select'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  return {
    value: select.value,
    options: select.options,
    clearable: false,
    searchable: false,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value.value, {
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
)(ReactSelect)
