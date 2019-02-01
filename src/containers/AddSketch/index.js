import { connect } from 'react-redux'
import AddSketch from '../../components/AddSketch'
import { getModules } from './selectors'
import getSketchesPath from '../../selectors/getSketchesPath'
import { uSketchCreate } from '../../store/sketches/actions'
import { projectChooseSketchesFolder } from '../../store/project/actions'
import { uiAddSketchToggleOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    items: getModules(state),
    sketchesPath: getSketchesPath(state),
    open: state.ui.addSketchOpen,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: (id) => { dispatch(uSketchCreate(id)) },
    onChooseFolderClick: () => { dispatch(projectChooseSketchesFolder()) },
    onExpandField: (category) => { dispatch(uiAddSketchToggleOpen(category)) },
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSketch)
