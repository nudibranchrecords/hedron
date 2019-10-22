import { connect } from 'react-redux'
import NodeList from '../../components/NodeList'
import Node from '../Node'
import withDeferRender from '../../utils/withDeferRender'
import getSketchShotIds from '../../selectors/getSketchShotIds'

const DeferredNode = withDeferRender(Node)

const mapStateToProps = (state, ownProps) => ({
  nodeIds: getSketchShotIds(state, ownProps.sketchId),
  title: 'Shots',
  type: 'shot',
  component: DeferredNode,
})

const ShotList = connect(
  mapStateToProps,
  null,
  null,
  {
    areStatePropsEqual: (next, prev) => next.nodeIds === prev.nodeIds,
  }
)(NodeList)

export default ShotList
