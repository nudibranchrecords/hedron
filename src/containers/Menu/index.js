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
  errorMessage: getProjectErrorLatest(state)
})

const fileFilters = [
  { name: 'JSON', extensions: ['json'] }
]

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: (next, prev) =>
      next.project === prev.project &&
      next.displays === prev.displays
  }
)(Menu)
