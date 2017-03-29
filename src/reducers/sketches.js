const defaultState = {
  currentSketchId: 'sketch_2',
  items: {
    'sketch_1': {
      title: 'Lorem Sketch',
      params: ['01', '02']
    },
    'sketch_2': {
      title: 'Ipsum Sketch',
      params: ['03', '04']
    }
  }
}

const sketches = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default sketches
