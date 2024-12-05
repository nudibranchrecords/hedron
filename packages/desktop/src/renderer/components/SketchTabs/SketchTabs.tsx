import { useCallback } from 'react'
import { SideTabs, SideTabsItem } from '@components/core/SideTabs/SideTabs'
import { useSketchList } from '@components/hooks/useSketchList'
import { useIsActiveSketch } from '@components/hooks/useIsActiveSketch'
import { useSetActiveSketchId } from '@components/hooks/useSetActiveSketchId'
import { useGlobalDialog } from '@components/GlobalDialogs/useGlobalDialog'

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
  const { openDialog } = useGlobalDialog('sketchModules')

  return (
    <SideTabs>
      {sketches.map(({ title, id }) => (
        <Item key={id} id={id}>
          {title}
        </Item>
      ))}
      <SideTabsItem iconName="add_circle" onClick={openDialog} />
    </SideTabs>
  )
}
