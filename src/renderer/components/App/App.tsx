// import { Audio } from '../Audio'
import { GlobalDialogs } from '../GlobalDialogs/GlobalDialogs'
import { Viewer } from '../Viewer'
import { WorkArea } from '../WorkArea/WorkArea'
import c from './App.module.css'

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
