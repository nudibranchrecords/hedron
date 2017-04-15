import { connect } from 'react-redux'
import Sketch from '../../components/Sketch'
import { sceneSketchDelete } from '../../store/scene/actions'

const mapStateToProps = (state, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    title: state.sketches[sketchId].title,
    params: state.sketches[sketchId].paramIds,
    sketchId: sketchId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    onDeleteClick: () => dispatch(sceneSketchDelete(sketchId))
  }
}

const CurrentSketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketch)

export default CurrentSketch
