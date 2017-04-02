import { connect } from 'react-redux'
import Sketch from '../../components/Sketch'
import { sketchesInstanceDelete } from '../../store/sketches/actions'

const mapStateToProps = (state, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    title: state.sketches.instances[sketchId].title,
    params: state.sketches.instances[sketchId].paramIds,
    sketchId: sketchId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    onDeleteClick: () => dispatch(sketchesInstanceDelete(sketchId))
  }
}

const CurrentSketch = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketch)

export default CurrentSketch
