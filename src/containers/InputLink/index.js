import { connect } from 'react-redux'
import InputLink from '../../components/InputLink'
import getInputLinkOptionIds from '../../selectors/getInputLinkOptionIds.js'
import getInputLinkModifierIds from '../../selectors/getInputLinkModifierIds'
import getInputLink from '../../selectors/getInputLink'
import getIsInputLinkActive from '../../selectors/getIsInputLinkActive'
import getCanInputLinkDisable from '../../selectors/getCanInputLinkDisable'
import { uInputLinkDelete } from '../../store/inputLinks/actions'
import { nodeTabOpen, nodeActiveInputLinkToggle } from '../../store/nodes/actions'
import { uAnimStart } from '../../store/anims/actions'

const mapStateToProps = (state, ownProps) => {
  const link = getInputLink(state, ownProps.id)
  return {
    title: link.title,
    optionIds: getInputLinkOptionIds(state, ownProps.id),
    modifierIds: getInputLinkModifierIds(state, ownProps.id),
    isActive: getIsInputLinkActive(state, ownProps.id),
    isActivateVisible: getCanInputLinkDisable(state, ownProps.id),
    toggleActionId: link.linkableActions.toggleActivate,
    sequencerGridId: link.sequencerGridId,
    animStartActionId: link.linkableActions.animStart,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDeleteClick: () => {
    dispatch(uInputLinkDelete(ownProps.id))
    dispatch(nodeTabOpen(ownProps.nodeId, undefined))
  },
  onActivateToggle: () => {
    dispatch(nodeActiveInputLinkToggle(ownProps.nodeId, ownProps.id))
  },
  onAnimStartClick: () => {
    dispatch(uAnimStart(ownProps.id))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.nodes === prev.nodes,
  }
)(InputLink)
