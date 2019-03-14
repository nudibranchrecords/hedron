import { connect } from 'react-redux'
import Tag from '../../components/Tag'
import { uInputLinkDelete } from '../../store/inputLinks/actions'

const mapStateToProps = (state, ownProps) => ({
  title: state.nodes[ownProps.id].title,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCloseClick: () => { dispatch(uInputLinkDelete(ownProps.id)) },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tag)
