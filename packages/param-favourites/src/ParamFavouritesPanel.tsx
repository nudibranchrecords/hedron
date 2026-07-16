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

  return (
    <ParamFavouritesControl
      favourites={[
        { id: 'favourite-1', name: 'Bright Pulse' },
        { id: 'favourite-2', name: 'Fog Drift' },
      ]}
      onFavouriteSelect={handleFavouriteSelect}
    />
  )
}
