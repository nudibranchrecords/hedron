import { connect } from 'react-redux'
import BankSelectItem from '../../components/BankSelectItem'
import { midiDeviceBankChange } from '../../store/midi/actions'

const mapStateToProps = (state, ownProps) => ({
  isActive: state.midi.devices[ownProps.id].bankIndex === ownProps.index,
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => { dispatch(midiDeviceBankChange(ownProps.id, ownProps.index)) },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BankSelectItem)
