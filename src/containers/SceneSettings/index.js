import { connect } from 'react-redux'
import SceneSettingsComponent from '../../components/SceneSettings'
import { uSceneSettingsUpdate } from '../../store/scenes/actions'
import getScene from '../../selectors/getScene'
import { reduxForm } from 'redux-form'

const mapStateToProps = (state, ownProps) => {
  const initialValues = getScene(state, ownProps.sceneId).settings
  const gppe = 'globalPostProcessingEnabled'

  return {
    initialValues,
    enableReinitialize: true,
    onChange: (values, dispatch) => {
      // TODO: Find cleaner way of doing this
      // On change can fire when the form changes because a different scene has been selected
      // We need to make sure this only fires when the form actually changes
      if (initialValues[gppe] !== values[gppe]) {
        dispatch(uSceneSettingsUpdate(ownProps.sceneId, values))
      }
    },
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({

})

const SceneSettings = reduxForm({
  form: 'sceneManager',
})(SceneSettingsComponent)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneSettings)
