import { connect } from 'react-redux'
import Sketch from '../../components/Sketch'

const mapStateToProps = (state, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  return {
    title: state.sketches.instances[sketchId].title,
    params: state.sketches.instances[sketchId].paramIds,
    sketchId: sketchId
  }
}

const CurrentSketch = connect(
  mapStateToProps,
  null
)(Sketch)

export default CurrentSketch
