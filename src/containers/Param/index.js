import { connect } from 'react-redux'
import Param from '../../components/Param'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.params[ownProps.paramId].title
  }
}

const ParamContainer = connect(
  mapStateToProps,
  null
)(Param)

export default ParamContainer
