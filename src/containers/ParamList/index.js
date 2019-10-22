import { connect } from 'react-redux'
import NodeList from '../../components/NodeList'
import Node from '../Node'
import makeGetVisibleSketchParamIds from '../../selectors/makeGetVisibleSketchParamIds'
import withDeferRender from '../../utils/withDeferRender'

const DeferredNode = withDeferRender(Node)

// Using memoized selector here to stop list of params rendering every time
const makeMapStateToProps = () => {
  const getVisibleSketchParamIds = makeGetVisibleSketchParamIds()
  const mapStateToProps = (state, ownProps) => ({
    nodeIds: getVisibleSketchParamIds(state, ownProps),
    title: 'Params',
    component: DeferredNode,
    type: 'param',
  })
  return mapStateToProps
}

const ParamList = connect(
  makeMapStateToProps,
  null,
  null,
  {
    areStatePropsEqual: (next, prev) => next.nodeIds === prev.nodeIds,
  }
)(NodeList)

export default ParamList
