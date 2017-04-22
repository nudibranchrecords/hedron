import { connect } from 'react-redux'
import Modifier from '../../components/Modifier'

const mapStateToProps = (state, ownProps) => {
  const param = state.params[ownProps.paramId]
  return {
    title: param.title
  }
}
export default connect(
  mapStateToProps,
  null
)(Modifier)
