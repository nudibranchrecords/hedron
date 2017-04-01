// import test from 'tape'
// import deepFreeze from 'deep-freeze'

// import sketchesReducer from '../reducer'
// import { returnsPreviousState } from '../../../testUtils'

// returnsPreviousState(sketchesReducer)

// test('(Reducer) sketchesReducer - Adds new sketch on SKETCHES_CREATE_INSTANCE', (t) => {
//   const originalState = {
//     params: {

//     },
//     modules: {
//       cubeSpinner: {
//         defaultTitle: 'Test Sketch',
//         params: {
//           'rotX': {
//             title: 'Rotation X',
//             defaultValue: 0.5
//           },
//           'rotY': {
//             title: 'Rotation Y',
//             key: 'rotY',
//             defaultValue: 0.5
//           }
//         }
//       }
//     },
//     sketches: {

//     }
//   }

//   deepFreeze(originalState)

//   const expectedState = {
//     '01': {
//       title: 'foo'
//     },
//     '02': {
//       title: 'bar'
//     },
//     '03': {
//       title: 'new'
//     }
//   }

//   const actual = sketchesReducer(originalState, {
//     type: 'SKETCHES_ADD',
//     payload: {
//       moduleId: 'cubeSpinner'
//     }
//   }, entireState)

//   t.deepEqual(actual, expectedState)
//   t.end()
// })
