export default (state) =>
  state.midi.connectedDeviceIds.map(id => state.midi.devices[id])
