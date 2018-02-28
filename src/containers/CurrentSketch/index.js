import { connect } from 'react-redux'
import Sketch from '../../components/Sketch'
import { sceneSketchDelete, sceneSketchReimport } from '../../store/scene/actions'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    title: state.sketches[sketchId].title,
    params: state.sketches[sketchId].paramIds,
    sketchId: sketchId,
    shots: state.sketches[sketchId].shotIds
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    onDeleteClick: () => dispatch(sceneSketchDelete(sketchId)),
    onRenameClick: () => dispatch(uiEditingOpen('sketchTitle', sketchId)),
    onReimportClick: () => dispatch(sceneSketchReimport(sketchId))
  }
}

const CurrentSketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketch)

export default CurrentSketch
