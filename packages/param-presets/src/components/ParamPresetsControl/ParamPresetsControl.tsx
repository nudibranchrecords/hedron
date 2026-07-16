import {
  Button,
  ControlGrid,
  Dialog,
  NodeControl,
  NodeControlInfo,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  PopoutMenu,
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
  TextInput,
  TextInputHandle,
  TriggerPad,
  TriggerPadHandle,
  IconName,
} from '@hedron-gl/ui-core'
import { createPortal } from 'react-dom'
import { FormEvent, useEffect, useRef, useState } from 'react'

export interface ParamPresetItem {
  id: string
  name: string
}

export interface ParamPresetsControlProps {
  presets: ParamPresetItem[]
  onPresetSelect: (presetId: string) => void
  onPresetSave: (presetName: string) => void
  onPresetDelete: (presetId: string) => void
  onPresetOverwrite: (presetId: string) => void
  onPresetEditTitle: (presetId: string, newName: string) => void
}

const Item = ({
  preset,
  onPadClick,
  onDelete,
  onOverwrite,
  onEditTitle,
}: {
  preset: ParamPresetItem
  onPadClick: (presetId: string) => void
  onDelete: (presetId: string) => void
  onOverwrite: (presetId: string) => void
  onEditTitle: (presetId: string) => void
}) => {
  const padRef = useRef<TriggerPadHandle>(null)

  const handlePadClick = () => {
    padRef.current?.blink()
    onPadClick(preset.id)
  }

  return (
    <NodeControl key={preset.id}>
      <NodeControlMain>
        <NodeControlInfo>
          <NodeControlTitle>{preset.name}</NodeControlTitle>

          <PopoutMenu
            className="ml-auto"
            items={[
              {
                label: 'Delete',
                icon: 'delete',
                onClick: () => onDelete(preset.id),
              },
              {
                label: 'Overwrite',
                icon: 'swap_horiz' as IconName,
                onClick: () => onOverwrite(preset.id),
              },
              {
                label: 'Rename',
                icon: 'edit',
                onClick: () => onEditTitle(preset.id),
              },
            ]}
          >
            <Button type="ghost" size="slim" iconName="more_horiz" />
          </PopoutMenu>
        </NodeControlInfo>

        <NodeControlInner>
          <TriggerPad ref={padRef} onMouseDown={handlePadClick} />
        </NodeControlInner>
      </NodeControlMain>
    </NodeControl>
  )
}

export const ParamPresetsControl = ({
  presets,
  onPresetSelect,
  onPresetSave,
  onPresetDelete,
  onPresetOverwrite,
  onPresetEditTitle,
}: ParamPresetsControlProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editPresetId, setEditPresetId] = useState<string | null>(null)
  const [editPresetName, setEditPresetName] = useState('')
  const editNameInputRef = useRef<TextInputHandle>(null)

  const onPadClick = (presetId: string) => {
    onPresetSelect(presetId)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setNewPresetName('')
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditPresetId(null)
    setEditPresetName('')
  }

  const savePreset = () => {
    const trimmedName = newPresetName.trim()
    if (!trimmedName) return

    onPresetSave(trimmedName)
    closeDialog()
  }

  const handleSaveSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    savePreset()
  }

  const openEditDialog = (presetId: string) => {
    const preset = presets.find((item) => item.id === presetId)
    if (!preset) return

    setEditPresetId(preset.id)
    setEditPresetName(preset.name)
    setIsEditDialogOpen(true)
  }

  useEffect(() => {
    if (!isEditDialogOpen) return

    editNameInputRef.current?.setValue(editPresetName)
  }, [editPresetName, isEditDialogOpen])

  const saveEditedTitle = () => {
    const trimmedName = editPresetName.trim()
    if (!trimmedName || !editPresetId) return

    onPresetEditTitle(editPresetId, trimmedName)
    closeEditDialog()
  }

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveEditedTitle()
  }

  return (
    <>
      <ControlGrid className="mb-xl">
        {presets.map((preset) => (
          <Item
            key={preset.id}
            preset={preset}
            onPadClick={onPadClick}
            onDelete={onPresetDelete}
            onOverwrite={onPresetOverwrite}
            onEditTitle={openEditDialog}
          />
        ))}
      </ControlGrid>

      <div>
        <Button type="secondary" size="slim" iconName="add" onClick={() => setIsDialogOpen(true)}>
          Save Preset
        </Button>
      </div>

      {isDialogOpen &&
        createPortal(
          <Dialog onBackgroundClick={closeDialog}>
            <Panel>
              <PanelHeader buttonOnClick={closeDialog}>Save Preset</PanelHeader>
              <form onSubmit={handleSaveSubmit} noValidate>
                <PanelBody>
                  <TextInput onValueChange={setNewPresetName} autoFocus />
                </PanelBody>
                <PanelActions>
                  <Button type="secondary" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button submit type="primary" disabled={!newPresetName.trim()}>
                    Confirm
                  </Button>
                </PanelActions>
              </form>
            </Panel>
          </Dialog>,
          document.body,
        )}

      {isEditDialogOpen &&
        createPortal(
          <Dialog onBackgroundClick={closeEditDialog}>
            <Panel>
              <PanelHeader buttonOnClick={closeEditDialog}>Edit Preset Title</PanelHeader>
              <form onSubmit={handleEditSubmit} noValidate>
                <PanelBody>
                  <TextInput ref={editNameInputRef} onValueChange={setEditPresetName} autoFocus />
                </PanelBody>
                <PanelActions>
                  <Button type="secondary" onClick={closeEditDialog}>
                    Cancel
                  </Button>
                  <Button submit type="primary" disabled={!editPresetName.trim()}>
                    Confirm
                  </Button>
                </PanelActions>
              </form>
            </Panel>
          </Dialog>,
          document.body,
        )}
    </>
  )
}
