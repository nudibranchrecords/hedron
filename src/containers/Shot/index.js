import { connect } from 'react-redux'
import Shot from '../../components/Shot'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.nodes[ownProps.nodeId].title,
    sketchId: state.nodes[ownProps.nodeId].sketchId,
    method: state.nodes[ownProps.nodeId].method
  }
}

export default connect(
  mapStateToProps,
  null
)(Shot)
