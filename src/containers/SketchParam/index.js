import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import withDeferRender from '../../utils/withDeferRender'
import { uiAuxToggleOpen } from '../../store/ui/actions'
import getIsAuxOpen from '../../selectors/getIsAuxOpen'
import uiEventEmitter from '../../utils/uiEventEmitter'
import getNode from '../../selectors/getNode'

const mapStateToProps = (state, ownProps) => ({
  advancedIsOpen: getIsAuxOpen(state, ownProps.nodeId),
  isHidden: getNode(state, ownProps.nodeId).hidden,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAdvancedClick: () => {
    dispatch(uiAuxToggleOpen(ownProps.nodeId))
    setTimeout(() => {
      uiEventEmitter.emit('recalc-param-heights')
    })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDeferRender(SketchParam))
