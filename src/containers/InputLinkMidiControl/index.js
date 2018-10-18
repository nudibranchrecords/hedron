import { connect } from 'react-redux'
import InputLinkMidiControl from '../../components/InputLinkMidiControl'
import { uInputLinkCreate } from '../../store/inputLinks/actions'
import getLinkableAction from '../../selectors/getLinkableAction'

const mapStateToProps = (state, ownProps) => {
  const linkableAction = getLinkableAction(state, ownProps.linkableActionId)
  return {
    inputLinkIds: linkableAction.inputLinkIds,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignClick: () => { dispatch(uInputLinkCreate(ownProps.linkableActionId, 'midi', 'linkableAction')) },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputLinkMidiControl)
