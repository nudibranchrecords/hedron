import { connect } from 'react-redux'
import InputSelect from '../../components/InputSelect'
import { uInputLinkCreate } from '../../store/inputLinks/actions'
import getNodeInputOptions from '../../selectors/getNodeInputOptions'

const mapStateToProps = (state, ownProps) => ({
  options: getNodeInputOptions(state, ownProps.nodeId),
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInputChange: (value) => {
      dispatch(uInputLinkCreate(ownProps.nodeId, value.value, value.type))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    areStatesEqual: () => true,
  }
)(InputSelect)
