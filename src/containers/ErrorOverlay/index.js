import { connect } from 'react-redux'
import ErrorOverlay from '../../components/ErrorOverlay'
import { projectErrorPopupClose, projectChooseSketchesFolder } from '../../store/project/actions'

const mapStateToProps = (state, ownProps) => {
  const errorPopup = state.project.errorPopup
  return {
    isVisible: errorPopup && errorPopup.message ? true : undefined,
    message: errorPopup && errorPopup.message || undefined,
    type: errorPopup && errorPopup.type || undefined
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCancelClick: () => {
    dispatch(projectErrorPopupClose())
  },
  onChooseSketchFolderClick: () => {
    dispatch(projectChooseSketchesFolder())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorOverlay)
