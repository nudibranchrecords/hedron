import { connect } from 'react-redux'
import Save from '../../components/Save'
import { projectSave, projectFilepathUpdate } from '../../store/project/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFileChange: (event) => dispatch(projectFilepathUpdate(event.target.value)),
  onButtonClick: () => dispatch(projectSave())
})

export default connect(
  null,
  mapDispatchToProps
)(Save)
