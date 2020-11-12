import { connect } from 'react-redux'
import Clock from '../../components/Clock'
import { uClockReset, clockSnap } from '../../store/clock/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  onResetClick: () => { dispatch(uClockReset()) },
  onTapTempoClick: () => { dispatch(clockSnap()) },
})

export default connect(
  null,
  mapDispatchToProps,
)(Clock)
