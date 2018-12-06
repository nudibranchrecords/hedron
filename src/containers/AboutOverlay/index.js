import { connect } from 'react-redux'
import AboutOverlay from '../../components/AboutOverlay'
import getIsAuxOpen from '../../selectors/getIsAuxOpen'
import { uiAuxToggleOpen } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    isVisible: getIsAuxOpen(state, 'aboutHedron'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCancelClick: () => {
    dispatch(uiAuxToggleOpen('aboutHedron'))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutOverlay)
