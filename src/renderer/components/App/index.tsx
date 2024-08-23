import { Viewer } from '../Viewer'
import c from './styles.module.css'

export const App = (): JSX.Element => {
  return (
    <div className={c.wrapper}>
      <div className={c.left}>
        <Viewer />
        {/* <Overview stats={stats} />
      <PanelDragger onHandleDrag={onLeftDrag} position={leftWidth} /> */}
      </div>
    </div>
  )
}
