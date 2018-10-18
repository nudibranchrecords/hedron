import { connect } from 'react-redux'
import MainViewOuter from '../../components/MainViewOuter'
import getMacroNodeLearning from '../../selectors/getMacroNodeLearning'
import { rMacroLearningStop } from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => {
  const macro = getMacroNodeLearning(state)
  return {
    notificationText: macro && `Macro Learning: ${macro.title}`,
    notificationButtonText: 'Stop Learning',
    isActive: macro !== undefined,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onNotificationButtonClick: () => { dispatch(rMacroLearningStop()) },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainViewOuter)
