import { connect } from 'react-redux'
import Clock from '../../components/Clock'
import { clockReset, clockSnap } from '../../store/clock/actions'
import { tap } from '../../inputs/GeneratedClock'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onResetClick: () => { dispatch(clockReset()) },
  onTapTempoClick: () => {
    tap()
    dispatch(clockSnap())
  },
})

export default connect(
  null,
  mapDispatchToProps,
)(Clock)
