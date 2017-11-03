import electron from 'electron'

import { connect } from 'react-redux'
import Menu from '../../components/Menu'
import { projectSave, projectLoadRequest, projectFilepathUpdate } from '../../store/project/actions'
import { windowSendOutput } from '../../store/windows/actions'
import { clockGeneratedToggle } from '../../store/clock/actions'

const { dialog } = electron.remote

const mapStateToProps = (state, ownProps) => ({
  filePath: state.project.filePath,
  saveIsDisabled: !state.project.filePath,
  clockIsGenerated: state.clock.isGenerated,
  displayOptions: state.displays.list.map((item, index) => ({
    value: index,
    label: item.bounds.width + 'x' + item.bounds.height
  }))
})

const fileFilters = [
  { name: 'JSON', extensions: ['json'] }
]

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveClick: () => dispatch(projectSave()),
  onSaveAsClick: () => {
    dialog.showSaveDialog({
      filters: fileFilters
    },
    filePath => {
      if (filePath) {
        dispatch(projectFilepathUpdate(filePath))
        dispatch(projectSave())
      }
    })
  },
  onLoadClick: () => {
    dialog.showOpenDialog({
      filters: fileFilters
    },
    filePath => {
      if (filePath) {
        dispatch(projectFilepathUpdate(filePath[0]))
        dispatch(projectLoadRequest())
      }
    })
  },
  onSendOutputChange: index => dispatch(windowSendOutput(index)),
  onClockToggleClick: () => dispatch(clockGeneratedToggle())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
