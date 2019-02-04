import { connect } from 'react-redux'
import Revealer from '../../components/Revealer'
import { uiAuxToggleOpen } from '../../store/ui/actions'
import getIsAuxOpen from '../../selectors/getIsAuxOpen'

const mapStateToProps = (state, ownProps) => ({
  isOpen: getIsAuxOpen(state, ownProps.auxId),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHeaderClick: () => {
    dispatch(uiAuxToggleOpen(ownProps.auxId))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Revealer)
