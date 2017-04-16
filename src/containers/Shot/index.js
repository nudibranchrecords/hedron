import { connect } from 'react-redux'
import Shot from '../../components/Shot'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.shots[ownProps.shotId].title,
    sketchId: state.shots[ownProps.shotId].sketchId,
    method: state.shots[ownProps.shotId].method
  }
}

export default connect(
  mapStateToProps,
  null
)(Shot)
