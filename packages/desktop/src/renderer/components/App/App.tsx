// import { Audio } from '../Audio'
import c from './App.module.css'
import { Audio } from '@components/Audio'
import { GlobalClock } from '@components/GlobalClock/GlobalClock'
import { GlobalDialogs } from '@components/GlobalDialogs/GlobalDialogs'
import { PerformanceStats } from '@components/PerformanceStats/PerformanceStats'
import { Viewer } from '@components/Viewer'
import { WorkArea } from '@components/WorkArea/WorkArea'

export const App = (): JSX.Element => {
  return (
    <div className={c.wrapper}>
      <div className={c.left}>
        <Viewer />
        <div className={c.widgetStrip}>
          <PerformanceStats />
          <div className={c.widgetItem}>
            <GlobalClock />
          </div>
          {/* <Audio /> */}
        </div>
      </div>
      <div className={c.right}>
        <WorkArea />
      </div>
      <GlobalDialogs />
    </div>
  )
}
