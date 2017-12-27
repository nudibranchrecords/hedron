import electron from 'electron'
import { connect } from 'react-redux'
import AddSketch from '../../components/AddSketch'
import { getModules } from './selectors'
import getSketchesPath from '../../selectors/getSketchesPath'
import { sceneSketchCreate } from '../../store/scene/actions'
import { projectSketchesPathUpdate } from '../../store/project/actions'
import engine from '../../Engine'

const { dialog } = electron.remote

const mapStateToProps = (state, ownProps) => (
  {
    items: getModules(state),
    sketchesPath: getSketchesPath(state)
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: (id) => dispatch(sceneSketchCreate(id)),
    onChooseFolderClick: () => {
      dialog.showOpenDialog({
        properties: ['openDirectory']
      },
      filePath => {
        if (filePath) {
          dispatch(projectSketchesPathUpdate(filePath[0]))
          engine.loadSketchModules(filePath[0])
        }
      })
    }
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSketch)
