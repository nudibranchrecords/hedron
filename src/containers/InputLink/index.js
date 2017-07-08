import { connect } from 'react-redux'
import InputLink from '../../components/InputLink'
import getInputLinkLfoOptionIds from '../../selectors/getInputLinkLfoOptionIds'
import getInputLinkModifierIds from '../../selectors/getInputLinkModifierIds'

const mapStateToProps = (state, ownProps) => ({
  title: state.inputLinks[ownProps.id].title,
  modifierIds: getInputLinkModifierIds(state, ownProps.id),
  lfoOptionIds: getInputLinkLfoOptionIds(state, ownProps.id)
})

export default connect(
  mapStateToProps
)(InputLink)
