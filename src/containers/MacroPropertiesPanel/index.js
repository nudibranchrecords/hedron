import { connect } from 'react-redux'
import PropertiesPanel from '../../containers/PropertiesPanel'
import MacroProperties from '../MacroProperties'
import getOpenedMacroNode from '../../selectors/getOpenedMacroNode'

const mapStateToProps = (state) => {
  const node = getOpenedMacroNode(state)
  return {
    Component: MacroProperties,
    node: node,
  }
}

export default connect(
  mapStateToProps,
  null
)(PropertiesPanel)
