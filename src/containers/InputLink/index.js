import { connect } from 'react-redux'
import InputLink from '../../components/InputLink'
import getInputLinkLfoOptionIds from '../../selectors/getInputLinkLfoOptionIds'
import getInputLinkModifierIds from '../../selectors/getInputLinkModifierIds'
import getInputLinkMidiOptionIds from '../../selectors/getInputLinkMidiOptionIds'
import { uInputLinkDelete } from '../../store/inputLinks/actions'
import { nodeTabOpen, nodeActiveInputLinkUpdate } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => ({
  title: state.inputLinks[ownProps.id].title,
  modifierIds: getInputLinkModifierIds(state, ownProps.id),
  lfoOptionIds: getInputLinkLfoOptionIds(state, ownProps.id),
  midiOptionIds: getInputLinkMidiOptionIds(state, ownProps.id)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDeleteClick: () => {
    dispatch(uInputLinkDelete(ownProps.id))
    dispatch(nodeTabOpen(ownProps.nodeId, 0))
  },
  onActivateToggle: () => {
    dispatch(nodeActiveInputLinkUpdate(ownProps.nodeId, ownProps.id))
  }
})

export default connect(
  mapStateToProps, mapDispatchToProps
)(InputLink)
