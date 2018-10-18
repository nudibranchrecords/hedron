import { connect } from 'react-redux'
import NodeInputInfo from '../../components/NodeInputInfo'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'

const mapStateToProps = (state, ownProps) => ({
  inputLinkIds: getNodeInputLinkIds(state, ownProps.nodeId),
  isLearningMidi: state.midi.learning === ownProps.nodeId,
})

export default connect(
  mapStateToProps
)(NodeInputInfo)
