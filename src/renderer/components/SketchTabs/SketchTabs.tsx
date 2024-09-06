import { SideTabs, SideTabsItem } from '../core/SideTabs/SideTabs'
import { useCallback } from 'react'
import { useSketchList } from 'src/renderer/store/hooks/useSketchList'
import { setStoreProperty } from 'src/renderer/store/actions/setStoreProperty'
import { useIsActiveSketch } from 'src/renderer/store/hooks/useIsActiveSketch'

interface ItemProps {
  children: React.ReactNode
  id: string
}

const Item = ({ id, children }: ItemProps) => {
  const isActive = useIsActiveSketch(id)

  const onClick = useCallback(() => {
    setStoreProperty('activeSketchId', id)
  }, [id])

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
