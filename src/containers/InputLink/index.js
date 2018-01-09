import { connect } from 'react-redux'
import InputLink from '../../components/InputLink'
import getInputLinkLfoOptionIds from '../../selectors/getInputLinkLfoOptionIds'
import getInputLinkModifierIds from '../../selectors/getInputLinkModifierIds'
import getInputLinkMidiOptionIds from '../../selectors/getInputLinkMidiOptionIds'
import getIsInputLinkActive from '../../selectors/getIsInputLinkActive'
import { uInputLinkDelete, uInputLinkCreate } from '../../store/inputLinks/actions'
import { nodeTabOpen, nodeActiveInputLinkToggle } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => ({
  title: state.inputLinks[ownProps.id].title,
  modifierIds: getInputLinkModifierIds(state, ownProps.id),
  lfoOptionIds: getInputLinkLfoOptionIds(state, ownProps.id),
  midiOptionIds: getInputLinkMidiOptionIds(state, ownProps.id),
  isActive: getIsInputLinkActive(state, ownProps.id)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDeleteClick: () => {
    dispatch(uInputLinkDelete(ownProps.id))
    dispatch(nodeTabOpen(ownProps.nodeId, 0))
  },
  onActivateToggle: () => {
    dispatch(nodeActiveInputLinkToggle(ownProps.nodeId, ownProps.id))
  },
  onActivateAssignClick: () => {
    dispatch(uInputLinkCreate(ownProps.id, 'midi', 'inputLinkToggle'))
  }
})

export default connect(
  mapStateToProps, mapDispatchToProps
)(InputLink)
