export const getSketches = (state) => {
  return Object.keys(state.sketches.instances).map((id) => (
    {
      title: state.sketches.instances[id].title,
      id
    }
  ))
}
