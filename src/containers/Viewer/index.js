import { connect } from 'react-redux'
import Viewer from '../../components/Viewer'
import world from '../../Engine/world'

const mapStateToProps = (state, ownProps) => (
  {
    canvasRef: (canvas) => world.setScene(canvas)
  }
)

export default connect(
  mapStateToProps,
  null,
  null,
  {
    areStatesEqual: () => true
  }
)(Viewer)
