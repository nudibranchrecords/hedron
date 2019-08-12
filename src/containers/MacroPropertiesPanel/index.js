import { connect } from 'react-redux'
import PropertiesPanel from '../../containers/PropertiesPanel'
import NodeProperties from '../NodeProperties'
import getOpenedMacroNode from '../../selectors/getOpenedMacroNode'
import { rMacroClose } from '../../store/macros/actions'

const mapStateToProps = (state) => {
  const node = getOpenedMacroNode(state)
  return {
    Component: NodeProperties,
    node: node,
    panelId: 'macros',
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
