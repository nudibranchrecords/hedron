import { connect } from 'react-redux'
import Shot from '../../components/Shot'
import getParamInfoText from '../../selectors/getParamInfoText'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.nodes[ownProps.nodeId].title,
    sketchId: state.nodes[ownProps.nodeId].sketchId,
    infoText: getParamInfoText(state, ownProps.nodeId),
    method: state.nodes[ownProps.nodeId].method
  }
}

export default connect(
  mapStateToProps,
  null
)(Shot)
