import { connect } from 'react-redux'
import InputLinkMidiControl from '../../components/InputLinkMidiControl'
import { uInputLinkCreate } from '../../store/inputLinks/actions'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => {
  const linkableAction = getNode(state, ownProps.linkableActionId)
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
