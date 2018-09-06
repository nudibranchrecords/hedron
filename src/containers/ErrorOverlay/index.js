import { connect } from 'react-redux'
import ErrorOverlay from '../../components/ErrorOverlay'
import { projectErrorPopupClose, projectChooseSketchesFolder } from '../../store/project/actions'

const mapStateToProps = (state, ownProps) => {
  const errorPopup = state.project.errorPopup
  return {
    isVisible: errorPopup && errorPopup.message ? true : undefined,
    message: errorPopup && errorPopup.message || undefined,
    code: errorPopup && errorPopup.code || undefined
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCancelClick: () => {
    dispatch(projectErrorPopupClose())
  },
  onChooseSketchFolderClick: () => {
    dispatch(projectChooseSketchesFolder(true))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorOverlay)
