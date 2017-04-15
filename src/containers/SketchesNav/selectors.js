export const getSketches = (state) => {
  return Object.keys(state.sketches).map((id) => (
    {
      title: state.sketches[id].title,
      id
    }
  ))
}
