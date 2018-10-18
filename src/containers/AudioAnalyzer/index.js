import { connect } from 'react-redux'
import AudioAnalyzer from '../../components/AudioAnalyzer'
import getUiIsEditingType from '../../selectors/getUiIsEditingType'
import { uiEditingToggle } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => (
  {
    isOpen: getUiIsEditingType(state) === 'audioAnalyzerPanel',
  }
)

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onWrapperClick: e => {
      e.stopPropagation()
    },
    onAnalyzerClick: () => {
      dispatch(uiEditingToggle('audioAnalyzerPanel'))
    },
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    // Audio analyzer gets state for bars via context
    // so we only need to check UI to see if panel is open
    areStatesEqual: (next, prev) => next.ui === prev.ui,
  }
)(AudioAnalyzer)
