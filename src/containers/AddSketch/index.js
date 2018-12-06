import { connect } from 'react-redux'
import AddSketch from '../../components/AddSketch'
import { getModules } from './selectors'
import getSketchesPath from '../../selectors/getSketchesPath'
import { uSketchCreate } from '../../store/sketches/actions'
import { projectChooseSketchesFolder } from '../../store/project/actions'

const mapStateToProps = (state, ownProps) => (
  {
    items: getModules(state),
    sketchesPath: getSketchesPath(state),
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: (id) => { dispatch(uSketchCreate(id)) },
    onChooseFolderClick: () => { dispatch(projectChooseSketchesFolder()) },
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSketch)
