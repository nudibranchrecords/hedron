import { connect } from 'react-redux'
import Menu from '../../components/Menu'
import { projectSave, projectLoadRequest, projectFilepathUpdate } from '../../store/project/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFileChange: (event) => dispatch(projectFilepathUpdate(event.target.value)),
  onSaveClick: () => dispatch(projectSave()),
  onLoadClick: () => dispatch(projectLoadRequest())
})

export default connect(
  null,
  mapDispatchToProps
)(Menu)
