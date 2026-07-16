import { HedronEngine } from '@hedron-gl/engine'

interface ParamFavouritesPanelProps {
  sketchId: string
  engine: HedronEngine
}

export const ParamFavouritesPanel = ({ sketchId, engine }: ParamFavouritesPanelProps) => {
  void sketchId
  void engine

  return <div>hi!</div>
}
