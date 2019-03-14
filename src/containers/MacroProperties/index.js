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
  const node = getNode(state, ownProps.macroId)
  const inputLinkIds = getNodeInputLinkIds(state, ownProps.macroId)
  const paramLinks = values(node.targetParamLinks)

  const activeInputLinkId = node.activeInputLinkId
  const activeInputLink = activeInputLinkId && getInputLink(state, activeInputLinkId)

  return {
    macroId: ownProps.macroId,
    title: node.title,
    isOpen: getIsMacroOpened(state, ownProps.macroId),
    paramLinks,
    inputLinkIds,
    inputSettingsAreVisible: inputLinkIds.length > 0,
    paramLinksAreVisible: paramLinks.length > 0,
    isLearning: state.macros.learningId === ownProps.macroId,
    numInputs: inputLinkIds.length,
    inputLinkTitle: activeInputLink && activeInputLink.title,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLearningClick: () => { dispatch(rMacroLearningToggle(ownProps.macroId)) },
  onDeleteClick: () => { dispatch(uMacroDelete(ownProps.macroId)) },
  onRenameClick: (e) => {
    e.stopPropagation()
    dispatch(uiEditingOpen('nodeTitle', ownProps.macroId))
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
