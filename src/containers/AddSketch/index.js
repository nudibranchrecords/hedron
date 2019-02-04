import { connect } from 'react-redux'
import AddSketch from '../../components/AddSketch'
import getCategorizedModules from '../../selectors/getCategorizedModules'
import getSketchesPath from '../../selectors/getSketchesPath'
import { uSketchCreate } from '../../store/sketches/actions'
import { projectChooseSketchesFolder } from '../../store/project/actions'

const mapStateToProps = (state, ownProps) => {
  const items = getCategorizedModules(state)
  return {
    items,
    hasSketches: items.looseItems.length > 0 || items.categorizedItems.length > 0,
    sketchesPath: getSketchesPath(state),
    open: state.ui.addSketchOpen,
  }
}

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
