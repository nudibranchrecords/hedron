export default state => {
  const arr = state.router.location.pathname.split('/')
  return arr[arr.length - 1]
}
