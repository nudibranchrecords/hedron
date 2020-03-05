import { clockReset, clockSnap } from '../../clock'
import { rClockReset } from './actions'
import { tap } from '../../inputs/GeneratedClock'

const handleClockReset = (action, store) => {
  clockReset()
  store.dispatch(rClockReset())
}

const handleClockSnap = () => {
  tap()
  clockSnap()
}

export default (action, store) => {
  switch (action.type) {
    case 'U_CLOCK_RESET':
      handleClockReset(action, store)
      break
    case 'CLOCK_SNAP':
      handleClockSnap(action, store)
      break
  }
}
