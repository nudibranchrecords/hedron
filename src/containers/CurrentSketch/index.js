import { connect } from 'react-redux'
import CurrentSketchComponent from '../../components/CurrentSketch'
import { uSketchDelete, uSketchReimport } from '../../store/sketches/actions'
import getSelectedSketchId from '../../selectors/getSelectedSketchId'
import { uiEditingOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  const sketchId = getSelectedSketchId(state)

  if (sketchId) {
    return {
      isSketch: true,
      title: state.sketches[sketchId].title,
      params: state.sketches[sketchId].paramIds,
      sketchId: sketchId,
      shots: state.sketches[sketchId].shotIds,
    }
  } else {
    return {
      isSketch: false,
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDeleteClick: sketchId => dispatch(uSketchDelete(sketchId)),
    onRenameClick: sketchId => {
      dispatch(uiEditingOpen('sketchTitle', sketchId))
    },
    onReimportClick: sketchId => dispatch(uSketchReimport(sketchId)),
  }
}

const CurrentSketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentSketchComponent)

export default CurrentSketch
