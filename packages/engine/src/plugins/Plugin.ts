import { ParamWithInfo } from '@store/selectors/getParamWithInfo'
import { InputOptionNodesConfig } from '@store/types'

/**
 * Class type for a Plugin.
 */
export interface IPlugin {
  /**
   * Unique ID for plugin
   */
  id: string

  /**
   * Type of input
   */
  inputType: string

  /**
   * The name of the plugin.
   */
  name: string

  /**
   * The description of the plugin.
   */
  description: string

  /**
   * Function to generate input options.
   */
  getOptionNodesConfig: (param: ParamWithInfo) => InputOptionNodesConfig
}
