import { connect } from 'react-redux'
import MacroProperties from '../../components/MacroProperties'
import getMacro from '../../selectors/getMacro'
import getIsMacroOpened from '../../selectors/getIsMacroOpened'
import getNode from '../../selectors/getNode'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'
import getInputLink from '../../selectors/getInputLink'
import { uiEditingOpen } from '../../store/ui/actions'
import { rMacroLearningToggle, uMacroDelete } from '../../store/macros/actions'
import { values } from 'lodash'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const macro = getMacro(state, node.macroId)
  const inputLinkIds = getNodeInputLinkIds(state, macro.nodeId)
  const paramLinks = values(macro.targetParamLinks)

  const activeInputLinkId = node.activeInputLinkId
  const activeInputLink = activeInputLinkId && getInputLink(state, activeInputLinkId)

  return {
    nodeId: macro.nodeId,
    title: node.title,
    isOpen: getIsMacroOpened(state, ownProps.id),
    macroId: macro.id,
    paramLinks,
    inputLinkIds,
    inputSettingsAreVisible: inputLinkIds.length > 0,
    paramLinksAreVisible: paramLinks.length > 0,
    isLearning: state.macros.learningId === ownProps.id,
    numInputs: inputLinkIds.length,
    inputLinkTitle: activeInputLink && activeInputLink.title,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLearningClick: (macroId) => { dispatch(rMacroLearningToggle(macroId)) },
  onDeleteClick: (macroId) => { dispatch(uMacroDelete(macroId)) },
  onRenameClick: (nodeId) => { dispatch(uiEditingOpen('nodeTitle', nodeId)) },
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
