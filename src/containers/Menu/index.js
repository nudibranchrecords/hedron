import electron from 'electron'

import { connect } from 'react-redux'
import Menu from '../../components/Menu'
import { projectSave, projectLoadRequest, projectFilepathUpdate } from '../../store/project/actions'
import { windowSendOutput } from '../../store/windows/actions'
import { openDevTools } from '../../windows'
import getProjectErrorLatest from '../../selectors/getProjectErrorLatest'

const { dialog } = electron.remote

const mapStateToProps = (state, ownProps) => ({
  filePath: state.project.filePath,
  saveIsDisabled: !state.project.filePath,
  displayOptions: state.displays.list.map((item, index) => {
    const width = item && item.bounds && item.bounds.width
    const height = item && item.bounds && item.bounds.height
    return {
      value: index,
      label: width + 'x' + height
    }
  }),
  onDevToolsClick: () => { openDevTools() },
  errorMessage: getProjectErrorLatest(state)
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
  onSendOutputChange: index => dispatch(windowSendOutput(index))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.project === prev.project &&
      next.displays === prev.displays
  }
)(Menu)
