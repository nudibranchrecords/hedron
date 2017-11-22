import { connect } from 'react-redux'
import Macros from '../../components/Macros'
import { uMacroCreate } from '../../store/macros/actions'

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onAddClick: () => { dispatch(uMacroCreate()) }
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Macros)
