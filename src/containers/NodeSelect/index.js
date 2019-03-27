import { connect } from 'react-redux'
import Select from '../Select'
import { nodeValueUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  return {
    id: ownProps.nodeId,
    buttonText: select.options.find(opt => opt.value === select.value).label,
    options: select.options,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: option => {
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
  null,
  {
    areStatesEqual: () => false,
  }
)(Select)
