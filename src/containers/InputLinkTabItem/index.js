import { connect } from 'react-redux'
import NodeTabItem from '../../components/NodeTabItem'
import { nodeTabOpen } from '../../store/nodes/actions'
import getNode from '../../selectors/getNode'
import getIsInputLinkActive from '../../selectors/getIsInputLinkActive'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)
  const link = getNode(state, ownProps.id)
  return {
    title: link.title,
    isSelected: ownProps.id === node.openedLinkId,
    isActive: getIsInputLinkActive(state, ownProps.id),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => { dispatch(nodeTabOpen(ownProps.nodeId, ownProps.id)) },
})

export default connect(
  mapStateToProps, mapDispatchToProps
)(NodeTabItem)
