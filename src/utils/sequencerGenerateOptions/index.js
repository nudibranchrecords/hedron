import uid from 'uid'

export default () => {
  return {
    grid: {
      id: uid(),
      value: [
        1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  }
}
