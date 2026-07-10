import { useEffect, useRef } from 'react'
import { CardList, Dialog, Panel, PanelBody, PanelHeader, useEngineStore } from '@hedron-gl/ui-core'
import c from './SketchModulesDialog.module.css'
import { useSketchesSearch } from './useSketchesSearch'
import { SketchCard } from './SketchCard'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'
import { useSketchModuleList } from '@components/hooks/useSketchModuleList'
import { useSetSelectedSketchId } from '@components/hooks/useSetSelectedSketchId'
import { useAppStore } from '@renderer/appStore'

export const SketchModulesDialog = ({ closeDialog }: GlobalDialogProps) => {
  const sketchModules = useSketchModuleList()
  const { searchTerm, setSearchTerm, filteredModules } = useSketchesSearch(sketchModules)
  const inputRef = useRef<HTMLInputElement>(null)
  const setSelectedSketchId = useSetSelectedSketchId()
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const addSketchToScene = useEngineStore((state) => state.addSketchToScene)

  useEffect(() => {
    // Focus the search input when dialog opens
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredModules.length > 0 && selectedSceneId) {
      const top = filteredModules[0]
      const id = addSketchToScene(selectedSceneId, top.moduleId)
      setSelectedSketchId(id)
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
