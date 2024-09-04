import { useAppStore } from 'src/renderer/engine/sketchesState'
import { SideTabs, SideTabsItem } from '../core/SideTabs/SideTabs'
import { useCallback, useMemo } from 'react'

interface ItemProps {
  children: React.ReactNode
  id: string
}

const Item = ({ id, children }: ItemProps) => {
  const activeSketchId = useAppStore((state) => state.activeSketchId)
  const isActive = activeSketchId === id

  const setActiveSketchId = useAppStore((state) => state.setActiveSketchId)

  const onClick = useCallback(() => {
    setActiveSketchId(id)
  }, [])

  return (
    <SideTabsItem isActive={isActive} onClick={onClick}>
      {children}
    </SideTabsItem>
  )
}

export const SketchTabs = () => {
  const sketches = useAppStore((state) => state.sketches)
  // TODO: Proper selectors/hooks to get this stuff
  const sketchesVals = useMemo(() => Object.values(sketches), [sketches])

  return (
    <SideTabs>
      {sketchesVals.map(({ title, id }) => (
        <Item key={id} id={id}>
          {title}
        </Item>
      ))}
    </SideTabs>
  )
}
