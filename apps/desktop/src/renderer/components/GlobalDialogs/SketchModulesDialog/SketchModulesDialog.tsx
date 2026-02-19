import { useCallback, useEffect, useRef } from 'react'
import { SketchModuleItem } from '@hedron-gl/engine'
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardContent,
  CardDetails,
  CardHeader,
  CardList,
  Dialog,
  Panel,
  PanelBody,
  PanelHeader,
  useEngineStore,
} from '@hedron-gl/ui-core'
import c from './SketchModulesDialog.module.css'
import { useSketchesSearch } from './useSketchesSearch'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'
import { useSketchModuleList } from '@components/hooks/useSketchModuleList'
import { useSetActiveSketchId } from '@components/hooks/useSetActiveSketchId'

interface SketchCardProps {
  item: SketchModuleItem
  closeDialog: () => void
}

export const SketchCard = ({
  item: {
    moduleId,
    config: { nodes, title, description },
  },
  closeDialog,
}: SketchCardProps) => {
  const setActiveSketchId = useSetActiveSketchId()
  const addSketch = useEngineStore((state) => state.addSketch)

  const onButtonClick = useCallback(() => {
    const id = addSketch(moduleId)
    setActiveSketchId(id)
    closeDialog()
  }, [addSketch, closeDialog, moduleId, setActiveSketchId])

  const numParams = nodes.filter((n) => n.nodeType === 'param').length
  const numShots = nodes.filter((n) => n.nodeType === 'shot').length

  return (
    <Card>
      <CardContent>
        <CardHeader iconName="token">{title}</CardHeader>
        <CardDetails>
          Params: {numParams} • Shots: {numShots}
        </CardDetails>
        {description && (
          <CardBody>
            <p>{description}</p>
          </CardBody>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={onButtonClick} iconName="add">
          Add To Scene
        </Button>
      </CardActions>
    </Card>
  )
}

export const SketchModulesDialog = ({ closeDialog }: GlobalDialogProps) => {
  const sketchModules = useSketchModuleList()
  const { searchTerm, setSearchTerm, filteredModules } = useSketchesSearch(sketchModules)
  const inputRef = useRef<HTMLInputElement>(null)
  const setActiveSketchId = useSetActiveSketchId()
  const addSketch = useEngineStore((state) => state.addSketch)

  useEffect(() => {
    // Focus the search input when dialog opens
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredModules.length > 0) {
      const top = filteredModules[0]
      const id = addSketch(top.moduleId)
      setActiveSketchId(id)
      closeDialog()
    }
  }

  return (
    <Dialog onBackgroundClick={closeDialog}>
      <Panel width="full" height="full" style={{ maxWidth: '60rem' }}>
        <PanelHeader iconName="add_circle" buttonOnClick={closeDialog}>
          Add sketch to scene
        </PanelHeader>
        <PanelBody scrollable={true}>
          <div className={c.searchContainer}>
            <input
              className={c.searchInput}
              ref={inputRef}
              type="search"
              placeholder="Search sketches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKeyDown}
              aria-label="Search sketches"
            />
            <span className={c.hint}>
              Press enter to add the top sketch, escape to clear search
            </span>
          </div>
          <CardList>
            {filteredModules.map((item) => (
              <SketchCard key={item.moduleId} item={item} closeDialog={closeDialog} />
            ))}
          </CardList>
        </PanelBody>
      </Panel>
    </Dialog>
  )
}
