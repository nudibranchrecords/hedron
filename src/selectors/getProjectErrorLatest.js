export default state => {
  const errors = state.project.errors
  return errors[errors.length - 1]
}
