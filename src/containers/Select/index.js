import { connect } from 'react-redux'
import Select from '../../components/Select'
import getIsEditing from '../../selectors/getIsEditing'
import { uiEditingToggle } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    isOpen: getIsEditing(state, ownProps.id, 'selectComponent'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onOpenClick: e => {
      dispatch(uiEditingToggle('selectComponent', ownProps.id))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Select)
