import { HedronEngine } from '@hedron-gl/engine'

interface ParamFavoruitesPanelProps {
  sketchId: string
  engine: HedronEngine
}

export const ParamFavoruitesPanel = ({ sketchId, engine }: ParamFavoruitesPanelProps) => {
  void sketchId
  void engine

  return <div />
}
