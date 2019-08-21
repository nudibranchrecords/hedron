import { connect } from 'react-redux'
import SceneSettingsComponent from '../../components/SceneSettings'
import { uSceneSettingsUpdate } from '../../store/scenes/actions'
import getScene from '../../selectors/getScene'
import { reduxForm } from 'redux-form'

const mapStateToProps = (state, ownProps) => ({
  initialValues: getScene(state, ownProps.sceneId).settings,
  enableReinitialize: true,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (values) => {
    dispatch(uSceneSettingsUpdate(ownProps.sceneId, values))
  },
})

const SceneSettings = reduxForm({
  form: 'sceneManager',
})(SceneSettingsComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneSettings)
