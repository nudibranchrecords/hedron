import { connect } from 'react-redux'
import App from '../../components/App'
import getPanelWidth from '../../selectors/getPanelWidth'
import { uiPanelResize, uiEditingClose } from '../../store/ui/actions'
import { withRouter } from 'react-router'

const mapStateToProps = (state, ownProps) => ({
  leftWidth: getPanelWidth(state, 'left')
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLeftDrag: value => {
    dispatch(uiPanelResize('left', value))
  },
  onWrapperClick: () => {
    dispatch(uiEditingClose())
  }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
