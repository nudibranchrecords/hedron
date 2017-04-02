import { connect } from 'react-redux'
import AddSketch from '../../components/AddSketch'
import { getModules } from './selectors'
import { sketchesInstanceCreate } from '../../store/sketches/actions'

const mapStateToProps = (state, ownProps) => (
  {
    items: getModules(state)
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: (id) => dispatch(sketchesInstanceCreate(id))
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSketch)
