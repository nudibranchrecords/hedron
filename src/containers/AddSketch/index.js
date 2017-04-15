import { connect } from 'react-redux'
import AddSketch from '../../components/AddSketch'
import { getModules } from './selectors'
import { sceneSketchCreate } from '../../store/scene/actions'

const mapStateToProps = (state, ownProps) => (
  {
    items: getModules(state)
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: (id) => dispatch(sceneSketchCreate(id))
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSketch)
