import { connect } from 'react-redux'
import PropertiesPanel from '../../containers/PropertiesPanel'
import MacroProperties from '../MacroProperties'
import getOpenedMacroNode from '../../selectors/getOpenedMacroNode'
import { rMacroClose } from '../../store/Macros/actions'

const mapStateToProps = (state) => {
  const node = getOpenedMacroNode(state)
  return {
    Component: MacroProperties,
    node: node,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseClick: () => {
      dispatch(rMacroClose())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesPanel)
