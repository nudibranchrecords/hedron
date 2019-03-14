import { PanelContext } from '../../context'
import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import Node from '../../components/Node'
import getNode from '../../selectors/getNode'
import getIsNodeOpen from '../../selectors/getIsNodeOpen'
import getActiveInputsText from '../../selectors/getActiveInputsText'
import { nodeShotFired } from '../../store/nodes/actions'

const mapStateToProps = (state, ownProps) => {
  const node = getNode(state, ownProps.nodeId)

  const inputLinkTitle = getActiveInputsText(state, ownProps.nodeId)

  return {
    title: node.title,
    isOpen: getIsNodeOpen(state, ownProps.nodeId, ownProps.panelId),
    inputLinkTitle,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const type = ownProps.type || 'param'

  return {
    onParamBarClick: type === 'shot'
    ? () => {
      dispatch(nodeShotFired(ownProps.nodeId, ownProps.sketchId, ownProps.shotMethod))
    } : undefined,
  }
}

const NodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Node)

const NodeWithContext = (props) => (
  <PanelContext.Consumer>
    {panelId => {
      const computedTheme = props.theme || (panelId !== undefined ? 'panel' : 'sketch')

      return <NodeContainer panelId={panelId} theme={computedTheme} {...props} />
    }}
  </PanelContext.Consumer>
)

NodeWithContext.propTypes = {
  theme: PropTypes.string,
}

export default NodeWithContext
