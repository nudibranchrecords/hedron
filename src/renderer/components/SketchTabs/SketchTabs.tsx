import { useAppStore } from 'src/renderer/store/useAppStore'
import { SideTabs, SideTabsItem } from '../core/SideTabs/SideTabs'
import { useCallback } from 'react'
import { useSketchList } from 'src/renderer/store/hooks/useSketchList'
import { setStoreProperty } from 'src/renderer/store/actions/setStoreProperty'

interface ItemProps {
  children: React.ReactNode
  id: string
}

const Item = ({ id, children }: ItemProps) => {
  const activeSketchId = useAppStore((state) => state.activeSketchId)
  const isActive = activeSketchId === id

  const onClick = useCallback(() => {
    setStoreProperty('activeSketchId', id)
  }, [])

  return (
    <SideTabsItem isActive={isActive} onClick={onClick}>
      {children}
    </SideTabsItem>
  )
}

export const SketchTabs = () => {
  const sketches = useSketchList()

  return (
    <SideTabs>
      {sketches.map(({ title, id }) => (
        <Item key={id} id={id}>
          {title}
        </Item>
      ))}
    </SideTabs>
  )
}
