import { connect } from 'react-redux'
import PropertiesPanel from '../../containers/PropertiesPanel'
import NodeProperties from '../NodeProperties'
import getOpenedSketchNode from '../../selectors/getOpenedSketchNode'
import { sketchNodeOpenedClose } from '../../store/sketches/actions'

const mapStateToProps = (state) => {
  const node = getOpenedSketchNode(state)
  return {
    Component: NodeProperties,
    node: node,
    panelId: 'sketch',
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCloseClick: () => {
      dispatch(sketchNodeOpenedClose(ownProps.sketchId))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesPanel)
