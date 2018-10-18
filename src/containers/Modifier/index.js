import { connect } from 'react-redux'
import Modifier from '../../components/Modifier'
import { uInputLinkCreate } from '../../store/inputLinks/actions'

const mapStateToProps = (state, ownProps) => {
  const node = state.nodes[ownProps.nodeId]
  return {
    title: node.title,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignClick: () => {
    dispatch(uInputLinkCreate(ownProps.nodeId, 'midi', 'midi'))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modifier)
