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

export interface ParamFavouriteItem {
  id: string
  name: string
}

export interface ParamFavouritesControlProps {
  favourites: ParamFavouriteItem[]
  onFavouriteSelect: (favouriteId: string) => void
  onFavouriteSave: (favouriteName: string) => void
  onFavouriteDelete: (favouriteId: string) => void
  onFavouriteOverwrite: (favouriteId: string) => void
  onFavouriteEditTitle: (favouriteId: string, newName: string) => void
}

const Item = ({
  favourite,
  onPadClick,
  onDelete,
  onOverwrite,
  onEditTitle,
}: {
  favourite: ParamFavouriteItem
  onPadClick: (favouriteId: string) => void
  onDelete: (favouriteId: string) => void
  onOverwrite: (favouriteId: string) => void
  onEditTitle: (favouriteId: string) => void
}) => {
  const padRef = useRef<TriggerPadHandle>(null)

  const handlePadClick = () => {
    padRef.current?.blink()
    onPadClick(favourite.id)
  }

  return (
    <NodeControl key={favourite.id}>
      <NodeControlMain>
        <NodeControlInfo>
          <NodeControlTitle>{favourite.name}</NodeControlTitle>

          <PopoutMenu
            className="ml-auto"
            items={[
              {
                label: 'Delete',
                icon: 'delete',
                onClick: () => onDelete(favourite.id),
              },
              {
                label: 'Overwrite',
                icon: 'swap_horiz' as IconName,
                onClick: () => onOverwrite(favourite.id),
              },
              {
                label: 'Rename',
                icon: 'edit',
                onClick: () => onEditTitle(favourite.id),
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

export const ParamFavouritesControl = ({
  favourites,
  onFavouriteSelect,
  onFavouriteSave,
  onFavouriteDelete,
  onFavouriteOverwrite,
  onFavouriteEditTitle,
}: ParamFavouritesControlProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFavouriteName, setNewFavouriteName] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFavouriteId, setEditFavouriteId] = useState<string | null>(null)
  const [editFavouriteName, setEditFavouriteName] = useState('')
  const editNameInputRef = useRef<TextInputHandle>(null)

  const onPadClick = (favouriteId: string) => {
    onFavouriteSelect(favouriteId)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setNewFavouriteName('')
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditFavouriteId(null)
    setEditFavouriteName('')
  }

  const saveFavourite = () => {
    const trimmedName = newFavouriteName.trim()
    if (!trimmedName) return

    onFavouriteSave(trimmedName)
    closeDialog()
  }

  const handleSaveSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveFavourite()
  }

  const openEditDialog = (favouriteId: string) => {
    const favourite = favourites.find((item) => item.id === favouriteId)
    if (!favourite) return

    setEditFavouriteId(favourite.id)
    setEditFavouriteName(favourite.name)
    setIsEditDialogOpen(true)
  }

  useEffect(() => {
    if (!isEditDialogOpen) return

    editNameInputRef.current?.setValue(editFavouriteName)
  }, [editFavouriteName, isEditDialogOpen])

  const saveEditedTitle = () => {
    const trimmedName = editFavouriteName.trim()
    if (!trimmedName || !editFavouriteId) return

    onFavouriteEditTitle(editFavouriteId, trimmedName)
    closeEditDialog()
  }

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveEditedTitle()
  }

  return (
    <>
      <ControlGrid className="mb-xl">
        {favourites.map((favourite) => (
          <Item
            key={favourite.id}
            favourite={favourite}
            onPadClick={onPadClick}
            onDelete={onFavouriteDelete}
            onOverwrite={onFavouriteOverwrite}
            onEditTitle={openEditDialog}
          />
        ))}
      </ControlGrid>

      <div>
        <Button type="secondary" size="slim" iconName="add" onClick={() => setIsDialogOpen(true)}>
          Save Favourite
        </Button>
      </div>

      {isDialogOpen &&
        createPortal(
          <Dialog onBackgroundClick={closeDialog}>
            <Panel>
              <PanelHeader buttonOnClick={closeDialog}>Save Favourite</PanelHeader>
              <form onSubmit={handleSaveSubmit} noValidate>
                <PanelBody>
                  <TextInput onValueChange={setNewFavouriteName} autoFocus />
                </PanelBody>
                <PanelActions>
                  <Button type="secondary" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button submit type="primary" disabled={!newFavouriteName.trim()}>
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
              <PanelHeader buttonOnClick={closeEditDialog}>Edit Favourite Title</PanelHeader>
              <form onSubmit={handleEditSubmit} noValidate>
                <PanelBody>
                  <TextInput
                    ref={editNameInputRef}
                    onValueChange={setEditFavouriteName}
                    autoFocus
                  />
                </PanelBody>
                <PanelActions>
                  <Button type="secondary" onClick={closeEditDialog}>
                    Cancel
                  </Button>
                  <Button submit type="primary" disabled={!editFavouriteName.trim()}>
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
