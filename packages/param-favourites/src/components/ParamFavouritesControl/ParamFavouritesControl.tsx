import {
  Button,
  ControlGrid,
  Dialog,
  NodeControl,
  NodeControlInfo,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
  TextInput,
  TriggerPad,
  TriggerPadHandle,
} from '@hedron-gl/ui-core'
import { createPortal } from 'react-dom'
import { FormEvent, useState, useRef } from 'react'

export interface ParamFavouriteItem {
  id: string
  name: string
}

export interface ParamFavouritesControlProps {
  favourites: ParamFavouriteItem[]
  onFavouriteSelect: (favouriteId: string) => void
  onFavouriteSave: (favouriteName: string) => void
}

const Item = ({
  favourite,
  onPadClick,
}: {
  favourite: ParamFavouriteItem
  onPadClick: (favouriteId: string) => void
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
}: ParamFavouritesControlProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFavouriteName, setNewFavouriteName] = useState('')

  const onPadClick = (favouriteId: string) => {
    onFavouriteSelect(favouriteId)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setNewFavouriteName('')
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

  return (
    <>
      <ControlGrid className="mb-xl">
        {favourites.map((favourite) => (
          <Item key={favourite.id} favourite={favourite} onPadClick={onPadClick} />
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
                  <input type="submit" hidden aria-hidden="true" />
                </PanelBody>
                <PanelActions>
                  <Button type="secondary" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button disabled={!newFavouriteName.trim()} onClick={saveFavourite}>
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
