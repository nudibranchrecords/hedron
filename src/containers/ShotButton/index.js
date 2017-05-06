import { connect } from 'react-redux'
import ShotButton from '../../components/ShotButton'
import { nodeShotFired } from '../../store/nodes/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(nodeShotFired(ownProps.sketchId, ownProps.method))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(ShotButton)
