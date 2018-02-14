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
  displayOptions: state.displays.list.map((item, index) => {
    const width = item && item.bounds && item.bounds.width
    const height = item && item.bounds && item.bounds.height
    return {
      value: index,
      label: width + 'x' + height
    }
  })
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
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.project === prev.project &&
      next.clock === prev.clock &&
      next.displays === prev.displays
  }
)(Menu)
