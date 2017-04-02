import { connect } from 'react-redux'
import AddSketch from '../../components/AddSketch'
import { getModules } from './selectors'
import { sketchesCreateInstance } from '../../store/sketches/actions'

const mapStateToProps = (state, ownProps) => (
  {
    items: getModules(state)
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: (id) => dispatch(sketchesCreateInstance(id))
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSketch)
