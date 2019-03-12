import { connect } from 'react-redux'
import MacroProperties from '../../components/MacroProperties'
import getIsMacroOpened from '../../selectors/getIsMacroOpened'
import getNode from '../../selectors/getNode'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'
import getInputLink from '../../selectors/getInputLink'
import { uiEditingOpen } from '../../store/ui/actions'
import { rMacroLearningToggle, uMacroDelete } from '../../store/macros/actions'
import { values } from 'lodash'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const inputLinkIds = getNodeInputLinkIds(state, ownProps.nodeId)
  const paramLinks = values(node.targetParamLinks)

  const activeInputLinkId = node.activeInputLinkId
  const activeInputLink = activeInputLinkId && getInputLink(state, activeInputLinkId)

  return {
    nodeId: ownProps.nodeId,
    title: node.title,
    isOpen: getIsMacroOpened(state, ownProps.nodeId),
    paramLinks,
    inputLinkIds,
    inputSettingsAreVisible: inputLinkIds.length > 0,
    paramLinksAreVisible: paramLinks.length > 0,
    isLearning: state.macros.learningId === ownProps.nodeId,
    numInputs: inputLinkIds.length,
    inputLinkTitle: activeInputLink && activeInputLink.title,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLearningClick: () => { dispatch(rMacroLearningToggle(ownProps.nodeId)) },
  onDeleteClick: () => { dispatch(uMacroDelete(ownProps.nodeId)) },
  onRenameClick: (e) => {
    e.stopPropagation()
    dispatch(uiEditingOpen('nodeTitle', ownProps.nodeId))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.nodes === prev.nodes &&
      next.macros.learningId === prev.macros.learningId &&
      next.macros.openedId === prev.macros.openedId,
  }
)(MacroProperties)
