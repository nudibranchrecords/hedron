import { connect } from 'react-redux'
import AboutOverlay from '../../components/AboutOverlay'

const mapStateToProps = (state, ownProps) => {
  return {
    isVisible: true,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCancelClick: () => {
    // dispatch(projectErrorPopupClose())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutOverlay)
