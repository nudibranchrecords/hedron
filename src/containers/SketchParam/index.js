import { connect } from 'react-redux'
import Node from '../Node'
import withDeferRender from '../../utils/withDeferRender'

export default connect()(withDeferRender(Node))
