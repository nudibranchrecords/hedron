import { connect } from 'react-redux'
import MacroItem from '../../components/MacroItem'
import getMacro from '../../selectors/getMacro'
import { rMacroLearningToggle } from '../../store/macros/actions'
import { values } from 'lodash'

const mapStateToProps = (state, ownProps) => {
  const macro = getMacro(state, ownProps.id)
  return {
    nodeId: macro.nodeId,
    items: values(macro.targetParamLinks),
    isLearning: state.macros.learningId === ownProps.id
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLearningClick: () => { dispatch(rMacroLearningToggle(ownProps.id)) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MacroItem)
