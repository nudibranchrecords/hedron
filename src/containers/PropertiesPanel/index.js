import { connect } from 'react-redux'
import PropertiesPanel from '../../components/PropertiesPanel'
import getOpenedSketchNode from '../../selectors/getOpenedSketchNode'

const mapStateToProps = (state) => {
  const node = getOpenedSketchNode(state)
  return {
    isOpen: node !== undefined,
    title: node && node.title,
    nodeId: node && node.id,
  }
}

export default connect(
  mapStateToProps,
  null
)(PropertiesPanel)
