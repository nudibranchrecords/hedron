import { connect } from 'react-redux'
import Clock from '../../components/Clock'

const mapStateToProps = (state, ownProps) => {
  return {
    beat: (state.clock.beat % 4) + 1,
    bar: (Math.floor(state.clock.beat / 4) % 4) + 1,
    phrase: (Math.floor(state.clock.beat / 16) % 4) + 1,
    bpm: state.clock.bpm
  }
}

export default connect(
  mapStateToProps
)(Clock)
