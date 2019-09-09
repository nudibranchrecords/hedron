import { connect } from 'react-redux'
import Select from '../../components/Select'
import getIsEditing from '../../selectors/getIsEditing'
import { uiEditingToggle } from '../../store/ui/actions'

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id || ownProps.name
  return {
    isOpen: getIsEditing(state, id, 'selectComponent'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id || ownProps.name
  return {
    onOpenClick: e => {
      dispatch(uiEditingToggle('selectComponent', id))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Select)
