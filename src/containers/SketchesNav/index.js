import { connect } from 'react-redux'
import SketchesNav from '../../components/SketchesNav'
import { getSketches } from './selectors'

const mapStateToProps = (state, ownProps) => (
  {
    items: getSketches(state)
  }
)

export default connect(
  mapStateToProps,
  null
)(SketchesNav)
