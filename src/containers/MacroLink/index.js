import { connect } from 'react-redux'
import MacroLink from '../../components/MacroLink'
import { uMacroTargetParamLinkDelete } from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => {
  const node = state.nodes[ownProps.nodeId]
  return {
    title: node.title,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDeleteClick: () => {
    dispatch(uMacroTargetParamLinkDelete(ownProps.macroId, ownProps.paramId))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MacroLink)
