import { connect } from 'react-redux'
import SketchParam from '../../components/SketchParam'
import withDeferRender from '../../utils/withDeferRender'

const mapStateToProps = (state, ownProps) => {
}

const ParamContainer = connect(
  mapStateToProps
)(withDeferRender(SketchParam))

export default ParamContainer
