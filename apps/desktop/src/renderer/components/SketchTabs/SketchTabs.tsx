import { useCallback } from 'react'
import { SideTabs, SideTabsItem } from '@hedron-gl/ui-core'
import { useSketchList } from '@components/hooks/useSketchList'
import { useIsActiveSketch } from '@components/hooks/useIsActiveSketch'
import { useSetActiveSketchId } from '@components/hooks/useSetActiveSketchId'
import { useGlobalDialog } from '@components/GlobalDialogs/useGlobalDialog'

interface ItemProps {
  children: React.ReactNode
  id: string
  isBroken?: boolean
}

const Item = ({ id, children, isBroken }: ItemProps) => {
  const isActive = useIsActiveSketch(id)
  const setActiveSketchId = useSetActiveSketchId()

  const onClick = useCallback(() => {
    setActiveSketchId(id)
  }, [id, setActiveSketchId])

  return (
    <SideTabsItem isActive={isActive} showErrorIcon={isBroken} onClick={onClick}>
      {children}
    </SideTabsItem>
  )
}

export const SketchTabs = () => {
  const sketches = useSketchList()
  const { openDialog } = useGlobalDialog('sketchModules')

  return (
    <SideTabs>
      {sketches.map(({ title, id, isBroken }) => (
        <Item key={id} id={id} isBroken={isBroken}>
          {title}
        </Item>
      ))}
      <SideTabsItem iconName="add_circle" onClick={openDialog} />
    </SideTabs>
  )
}
