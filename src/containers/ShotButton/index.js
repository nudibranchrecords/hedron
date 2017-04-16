import { connect } from 'react-redux'
import ShotButton from '../../components/ShotButton'
import { shotFired } from '../../store/shots/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(shotFired(ownProps.sketchId, ownProps.method))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(ShotButton)
