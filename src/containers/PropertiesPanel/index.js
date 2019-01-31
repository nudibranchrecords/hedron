import { connect } from 'react-redux'
import MenuPanel from '../../components/MenuPanel'
import VisibleSwitch from '../../components/VisibleSwitch'
import getOpenedSketchNode from '../../selectors/getOpenedSketchNode'

const mapStateToProps = (state) => {
  const node = getOpenedSketchNode(state)
  return {
    component: MenuPanel,
    isVisible: node !== undefined,
    title: node && node.title,
  }
}

export default connect(
  mapStateToProps,
  null
)(VisibleSwitch)
