import { connect } from 'react-redux'
import App from '../../components/App'
import getPanelWidth from '../../selectors/getPanelWidth'
import { uiPanelResize } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => ({
  leftWidth: getPanelWidth(state, 'left')
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLeftDrag: value => {
    dispatch(uiPanelResize('left', value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
