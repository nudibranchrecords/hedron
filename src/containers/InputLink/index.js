import { connect } from 'react-redux'
import InputLink from '../../components/InputLink'
// import getNodeLfoOptionIds from '../../selectors/getNodeLfoOptionIds'
import getInputLinkModifierIds from '../../selectors/getInputLinkModifierIds'

const mapStateToProps = (state, ownProps) => ({
  title: state.inputLinks[ownProps.id].title,
  modifierIds: getInputLinkModifierIds(state, ownProps.id)
  // lfoOptionIds: getNodeLfoOptionIds(state, ownProps.nodeId)
})

export default connect(
  mapStateToProps
)(InputLink)
