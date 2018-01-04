import { connect } from 'react-redux'
import App from '../../components/App'
import getPanelWidth from '../../selectors/getPanelWidth'

const mapStateToProps = (state, ownProps) => ({
  leftWidth: getPanelWidth(state, 'left')
})

export default connect(mapStateToProps)(App)
