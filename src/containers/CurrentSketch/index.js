import { connect } from 'react-redux'
import CurrentSketchComponent from '../../components/CurrentSketch'
import { uSketchDelete, uSketchReimport } from '../../store/sketches/actions'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  const sketchId = ownProps.match.params.sketchId

  if (sketchId) {
    return {
      isSketch: true,
      title: state.sketches[sketchId].title,
      params: state.sketches[sketchId].paramIds,
      sketchId: sketchId,
      shots: state.sketches[sketchId].shotIds
    }
  } else {
    return {
      isSketch: false
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    onDeleteClick: () => dispatch(uSketchDelete(sketchId)),
    onRenameClick: () => dispatch(uiEditingOpen('sketchTitle', sketchId)),
    onReimportClick: () => dispatch(uSketchReimport(sketchId))
  }
}

const CurrentSketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentSketchComponent)

export default CurrentSketch
