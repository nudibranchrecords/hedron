import { connect } from 'react-redux'
import AudioAnalyzer from '../../components/AudioAnalyzer'
import { getBands } from './selectors'

const mapStateToProps = (state, ownProps) => ({
  bands: getBands(state)
})

export default connect(
  mapStateToProps, null, null, { pure: false }
)(AudioAnalyzer)
