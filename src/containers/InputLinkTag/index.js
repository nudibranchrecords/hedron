import { connect } from 'react-redux'
import Tag from '../../components/Tag'

const mapStateToProps = (state, ownProps) => ({
  title: state.inputLinks[ownProps.id].title
})

export default connect(
  mapStateToProps
)(Tag)
