import { connect } from 'react-redux'
import Macros from '../../components/Macros'
import getMacros from '../../selectors/getMacros'
import { uMacroCreate } from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => ({
  items: getMacros(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddClick: () => { dispatch(uMacroCreate()) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Macros)
