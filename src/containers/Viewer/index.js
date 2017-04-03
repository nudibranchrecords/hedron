import { connect } from 'react-redux'
import Viewer from '../../components/Viewer'
import World from '../../Engine/World'

const mapStateToProps = (state, ownProps) => (
  {
    canvasRef: (canvas) => World.setScene(canvas)
  }
)

export default connect(
  mapStateToProps,
  null
)(Viewer)
