import { connect } from 'react-redux'
import MacroLink from '../../components/MacroLink'

const mapStateToProps = (state, ownProps) => {
  const node = state.nodes[ownProps.nodeId]
  return {
    title: node.title
  }
}

export default connect(
  mapStateToProps
)(MacroLink)
