import { connect } from 'react-redux'
import Menu from '../../components/Menu'
import { projectSave, projectLoadRequest, projectFilepathUpdate } from '../../store/project/actions'
import { windowSendOutput } from '../../store/windows/actions'
import { clockGeneratedToggle } from '../../store/clock/actions'

const mapStateToProps = (state, ownProps) => ({
  filePath: state.project.filePath,
  clockIsGenerated: state.clock.isGenerated
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
  onSaveClick: () => dispatch(projectSave()),
  onSendOutputClick: () => dispatch(windowSendOutput()),
  onClockToggleClick: () => dispatch(clockGeneratedToggle())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
