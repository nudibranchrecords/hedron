import { SideTabs, SideTabsItem } from '../core/SideTabs/SideTabs'
import { useCallback } from 'react'
import { useSketchList } from 'src/renderer/hooks/useSketchList'
import { useIsActiveSketch } from 'src/renderer/hooks/useIsActiveSketch'
import { engineStore } from 'src/renderer/engine'

interface ItemProps {
  children: React.ReactNode
  id: string
}

const Item = ({ id, children }: ItemProps) => {
  const isActive = useIsActiveSketch(id)

  const onClick = useCallback(() => {
    engineStore.setState({ activeSketchId: id })
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
