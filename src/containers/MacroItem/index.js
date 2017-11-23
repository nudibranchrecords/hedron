import { connect } from 'react-redux'
import MacroItem from '../../components/MacroItem'
import getMacro from '../../selectors/getMacro'
import { uMacroTargetParamLinkAdd } from '../../store/macros/actions'
import { values } from 'lodash'

const mapStateToProps = (state, ownProps) => {
  const macro = getMacro(state, ownProps.id)
  return {
    nodeId: macro.nodeId,
    items: values(macro.targetParamLinks)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddClick: () => { dispatch(uMacroTargetParamLinkAdd(ownProps.id, 'rxl3jmx')) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MacroItem)
