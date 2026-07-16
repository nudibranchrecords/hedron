import {
  ControlGrid,
  NodeControl,
  NodeControlInfo,
  NodeControlInner,
  NodeControlMain,
  NodeControlTitle,
  TriggerPad,
  TriggerPadHandle,
} from '@hedron-gl/ui-core'
import { useRef } from 'react'

export interface ParamFavouriteItem {
  id: string
  name: string
}

export interface ParamFavouritesControlProps {
  favourites: ParamFavouriteItem[]
  onFavouriteSelect: (favouriteId: string) => void
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
}: ParamFavouritesControlProps) => {
  const onPadClick = (favouriteId: string) => {
    onFavouriteSelect(favouriteId)
  }

  return (
    <ControlGrid>
      {favourites.map((favourite) => (
        <Item key={favourite.id} favourite={favourite} onPadClick={onPadClick} />
      ))}
    </ControlGrid>
  )
}
