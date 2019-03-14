import { connect } from 'react-redux'
import Macros from '../../components/Macros'
import getMacros from '../../selectors/getMacros'
import { uMacroCreate } from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => ({
  items: getMacros(state),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddClick: e => {
    e.stopPropagation()
    dispatch(uMacroCreate())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: (next, prev) =>
    Object.keys(next.macros.nodeIds).length === Object.keys(prev.macros.nodeIds).length,
  }
)(Macros)
