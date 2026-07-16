import { HedronEngine } from '@hedron-gl/engine'
import { ParamFavouritesControl } from './components/ParamFavouritesControl/ParamFavouritesControl'

interface ParamFavouritesPanelProps {
  sketchId: string
  engine: HedronEngine
}

export const ParamFavouritesPanel = ({ sketchId, engine }: ParamFavouritesPanelProps) => {
  void sketchId
  void engine

  const handleFavouriteSelect = (favouriteId: string) => {
    void favouriteId
  }

  const handleFavouriteSave = (favouriteName: string) => {
    void favouriteName
  }

  const handleFavouriteDelete = (favouriteId: string) => {
    void favouriteId
  }

  const handleFavouriteOverwrite = (favouriteId: string) => {
    void favouriteId
  }

  const handleFavouriteEditTitle = (favouriteId: string, newName: string) => {
    void favouriteId
    void newName
  }

  return (
    <ParamFavouritesControl
      favourites={[
        { id: 'favourite-1', name: 'Bright Pulse' },
        { id: 'favourite-2', name: 'Fog Drift' },
      ]}
      onFavouriteSelect={handleFavouriteSelect}
      onFavouriteSave={handleFavouriteSave}
      onFavouriteDelete={handleFavouriteDelete}
      onFavouriteOverwrite={handleFavouriteOverwrite}
      onFavouriteEditTitle={handleFavouriteEditTitle}
    />
  )
}
