// import { Audio } from '../Audio'
import c from './App.module.css'
import { GlobalDialogs } from '@components/GlobalDialogs/GlobalDialogs'
import { Viewer } from '@components/Viewer'
import { WorkArea } from '@components/WorkArea/WorkArea'

export const App = (): JSX.Element => {
  return (
    <div className={c.wrapper}>
      <div className={c.left}>
        <Viewer />
        {/* <Audio /> */}
        {/* <Overview stats={stats} />
      <PanelDragger onHandleDrag={onLeftDrag} position={leftWidth} /> */}
      </div>
      <div className={c.right}>
        <WorkArea />
      </div>
      <GlobalDialogs />
    </div>
  )
}
