import { IPlugin } from '@hedron-gl/engine'

export class ParamPresetsPlugin implements IPlugin {
  public readonly id = 'param-presets'
  public readonly name = 'Param Presets'
  public readonly iconName = 'swap_horiz'
  public readonly description = 'Stores named parameter presets per sketch module.'
}
