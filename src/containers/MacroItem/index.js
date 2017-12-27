import { connect } from 'react-redux'
import MacroItem from '../../components/MacroItem'
import getMacro from '../../selectors/getMacro'
import getNodeInputLinkIds from '../../selectors/getNodeInputLinkIds'
import { rMacroLearningToggle, uMacroDelete } from '../../store/macros/actions'
import { values } from 'lodash'

const mapStateToProps = (state, ownProps) => {
  const macro = getMacro(state, ownProps.id)
  const inputLinkIds = getNodeInputLinkIds(state, macro.nodeId)
  const paramLinks = values(macro.targetParamLinks)
  return {
    nodeId: macro.nodeId,
    macroId: macro.id,
    paramLinks,
    inputLinkIds,
    inputSettingsAreVisible: inputLinkIds.length > 0,
    paramLinksAreVisible: paramLinks.length > 0,
    isLearning: state.macros.learningId === ownProps.id
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLearningClick: () => { dispatch(rMacroLearningToggle(ownProps.id)) },
  onDeleteClick: () => { dispatch(uMacroDelete(ownProps.id)) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MacroItem)
