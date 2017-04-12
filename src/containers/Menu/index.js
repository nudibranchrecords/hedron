import { connect } from 'react-redux'
import Menu from '../../components/Menu'
import { projectSave, projectLoadRequest, projectFilepathUpdate } from '../../store/project/actions'

const mapStateToProps = (state, ownProps) => ({
  filePath: state.project.filePath
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFileSaveChange: (event) => {
    dispatch(projectFilepathUpdate(event.target.value))
    dispatch(projectSave())
  },
  onFileLoadChange: (event) => {
    dispatch(projectFilepathUpdate(event.target.value))
    dispatch(projectLoadRequest())
  },
  onSaveClick: () => dispatch(projectSave())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
