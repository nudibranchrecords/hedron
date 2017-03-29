import { connect } from 'react-redux'
import Sketch from '../../components/Sketch'

const mapStateToProps = (state, ownProps) => {
  const sketchId = ownProps.match.params.sketchId
  console.log(ownProps)
  return {
    title: state.sketches.items[sketchId].title,
    params: state.sketches.items[sketchId].params,
    sketchId: sketchId
  }
}

const CurrentSketch = connect(
  mapStateToProps,
  null
)(Sketch)

export default CurrentSketch
