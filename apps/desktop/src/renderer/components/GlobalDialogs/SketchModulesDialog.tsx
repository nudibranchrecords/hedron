import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [search, setSearch] = useState('')
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

  // Filter and sort modules
  const filteredModules = useMemo(() => {
    if (!search) return sketchModules

    const s = search.toLowerCase()

    return [...sketchModules]
      .filter((item) => {
        const title = item.config.title.toLowerCase()
        return title.includes(s)
      })
      .sort((a, b) => {
        const aTitle = a.config.title.toLowerCase()
        const bTitle = b.config.title.toLowerCase()
        const aStarts = aTitle.startsWith(s)
        const bStarts = bTitle.startsWith(s)
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
        // If both or neither start, sort alphabetically
        return aTitle.localeCompare(bTitle)
      })
  }, [search, sketchModules])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredModules.length > 0) {
      const top = filteredModules[0]
      const id = addSketch(top.moduleId)
      setActiveSketchId(id)
      closeDialog()
    } else if (e.key === 'Escape') {
      // Optionally re-focus and select
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }
  }

  return (
    <Dialog onBackgroundClick={closeDialog}>
      <Panel width="full" height="full" style={{ maxWidth: '60rem' }}>
        <PanelHeader iconName="add_circle" buttonOnClick={closeDialog}>
          Add sketch to scene
        </PanelHeader>
        <PanelBody scrollable={true}>
          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
              gap: '0.5rem',
              flexDirection: 'row',
            }}
          >
            <input
              ref={inputRef}
              type="search"
              placeholder="Search sketches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleInputKeyDown}
              style={{
                width: '100%',
                maxWidth: '30rem',
              }}
              aria-label="Search sketches"
            />
            <div>Press enter to add the top sketch, escape to clear search</div>
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
