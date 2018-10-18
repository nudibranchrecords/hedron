import { connect } from 'react-redux'
import Select from '../../components/Select'
import { nodeValueUpdate } from '../../store/nodes/actions'
import { uInputLinkCreate } from '../../store/inputLinks/actions'

const mapStateToProps = (state, ownProps) => {
  const select = state.nodes[ownProps.nodeId]
  return {
    value: select.value,
    title: select.title,
    options: select.options,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => {
      dispatch(nodeValueUpdate(ownProps.nodeId, value.value, {
        dontMutate: true,
      }))
    },
    onAssignClick: () => {
      dispatch(uInputLinkCreate(ownProps.nodeId, 'midi', 'midi'))
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
