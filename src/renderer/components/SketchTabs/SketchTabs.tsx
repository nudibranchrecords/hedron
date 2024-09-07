import { SideTabs, SideTabsItem } from '../core/SideTabs/SideTabs'
import { useCallback } from 'react'
import { useSketchList } from '../hooks/useSketchList'
import { useIsActiveSketch } from '../hooks/useIsActiveSketch'
import { useSetActiveSketchId } from '../hooks/useSetActiveSketchId'

interface ItemProps {
  children: React.ReactNode
  id: string
}

const Item = ({ id, children }: ItemProps) => {
  const isActive = useIsActiveSketch(id)
  const setActiveSketchId = useSetActiveSketchId()

  const onClick = useCallback(() => {
    setActiveSketchId(id)
  }, [id, setActiveSketchId])

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
