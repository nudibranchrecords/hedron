import { useCallback } from 'react'
import { SideTabs, SideTabsItem } from '@hedron-gl/ui-core'
import { useSketchList } from '@components/hooks/useSketchList'
import { useIsSelectedSketch } from '@components/hooks/useIsSelectedSketch'
import { useSetSelectedSketchId } from '@components/hooks/useSetSelectedSketchId'
import { useGlobalDialog } from '@components/GlobalDialogs/useGlobalDialog'

interface ItemProps {
  children: React.ReactNode
  id: string
  isBroken?: boolean
}

const Item = ({ id, children, isBroken }: ItemProps) => {
  const isActive = useIsSelectedSketch(id)
  const setSelectedSketchId = useSetSelectedSketchId()

  const onClick = useCallback(() => {
    setSelectedSketchId(id)
  }, [id, setSelectedSketchId])

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
