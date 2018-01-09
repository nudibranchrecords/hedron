import { connect } from 'react-redux'
import InputLinkMidiControl from '../../components/InputLinkMidiControl'
import { uInputLinkCreate } from '../../store/inputLinks/actions'

const mapStateToProps = (state, ownProps) => ({

})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignClick: () => { dispatch(uInputLinkCreate(ownProps.linkableActionId, 'midi', 'linkableAction')) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputLinkMidiControl)
