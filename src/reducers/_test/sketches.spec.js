// import { expect } from 'chai'

// import sketchesReducer from '../sketches'
// import deepFreeze from 'deep-freeze'

// describe('(Reducer) sketchesReducer', () => {
//   it('Should return the previous state if an action was not matched.', () => {
//     let expectedState = {
//       sketch_1: {
//         title: 'Sketch 1',
//         params: ['01', '02']
//       },
//       sketch_2: {
//         title: 'Sketch 2',
//         params: ['03', '04']
//       }
//     }

//     deepFreeze(expectedState)
//     let actualState = sketchesReducer(expectedState, {})
//     expect(actualState).to.deep.equal(expectedState)
//     actualState = sketchesReducer(actualState, { type: '@@@@@@@' })
//     expect(actualState).to.deep.equal(expectedState)
//   })
// })
