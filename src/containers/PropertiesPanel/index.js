import { connect } from 'react-redux'
import PropertiesPanel from '../../components/PropertiesPanel'

const mapStateToProps = (state, ownProps) => {
  const node = ownProps.node
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
