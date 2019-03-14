import { connect } from 'react-redux'
import MainViewOuter from '../../components/MainViewOuter'
import getLearningMacro from '../../selectors/getLearningMacro'
import {
  rMacroLearningStop, uMacroAddAllForSketch, uMacroAddAllForScene,
} from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => {
  const macro = getLearningMacro(state)
  const page = state.router.location.pathname.split('/')[1]
  const buttonsText = ['Stop Learning']

  if (page === 'scenes') {
    buttonsText.push(
      '+ All for Scene',
      '+ All for Sketch',
    )
  }
  return {
    notificationText: macro && `Macro Learning: ${macro.title}`,
    isActive: macro !== undefined,
    buttonsText,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  buttonsOnClick: [
    () => { dispatch(rMacroLearningStop()) },
    () => { dispatch(uMacroAddAllForScene()) },
    () => { dispatch(uMacroAddAllForSketch()) },
  ],
})

const mergeProps = (stateProps, dispatchProps, props) => {
  const buttons = stateProps.buttonsText.map((text, index) => ({
    text,
    onClick: dispatchProps.buttonsOnClick[index],
  }))

  return { ...props, ...stateProps, ...dispatchProps, buttons }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MainViewOuter)
