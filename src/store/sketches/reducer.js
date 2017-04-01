const defaultState = {
  'sketch_1': {
    id: 'sketch_1',
    module: 'test',
    title: 'Lorem Sketch',
    params: ['01', '02']
  },
  'sketch_2': {
    id: 'sketch_2',
    module: 'test',
    title: 'Ipsum Sketch',
    params: ['03', '04']
  }
}

const sketchesReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default sketchesReducer
