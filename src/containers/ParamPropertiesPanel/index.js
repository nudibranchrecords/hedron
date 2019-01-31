import { connect } from 'react-redux'
import PropertiesPanel from '../../containers/PropertiesPanel'
import ParamProperties from '../ParamProperties'
import getOpenedSketchNode from '../../selectors/getOpenedSketchNode'

const mapStateToProps = (state) => {
  const node = getOpenedSketchNode(state)
  return {
    Component: ParamProperties,
    node: node,
  }
}

export default connect(
  mapStateToProps,
  null
)(PropertiesPanel)
