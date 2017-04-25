import { connect } from 'react-redux'
import Modifier from '../../components/Modifier'

const mapStateToProps = (state, ownProps) => {
  const node = state.nodes[ownProps.nodeId]
  return {
    title: node.title
  }
}
export default connect(
  mapStateToProps,
  null
)(Modifier)
