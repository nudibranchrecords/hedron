import { IPlugin } from '@hedron-gl/engine'

export class ParamFavouritesPlugin implements IPlugin {
  public readonly id = 'param-favourites'
  public readonly name = 'Param Favourites'
  public readonly iconName = 'star'
  public readonly description = 'Stores named parameter favourite presets per sketch module.'
}
