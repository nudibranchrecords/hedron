import { connect } from 'react-redux'
import ShotButton from '../../components/ShotButton'
import { inputLinkShotFired } from '../../store/inputLinks/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(inputLinkShotFired(ownProps.sketchId, ownProps.method))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(ShotButton)
