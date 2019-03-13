import { connect } from 'react-redux'
import InputLinkMidiControl from '../../components/InputLinkMidiControl'
import { uiNodeToggleOpen } from '../../store/ui/actions'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const linkableAction = getNode(state, ownProps.linkableActionId)
  return {
    inputLinkIds: linkableAction.inputLinkIds,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignClick: () => { dispatch(uiNodeToggleOpen(ownProps.linkableActionId)) },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputLinkMidiControl)
