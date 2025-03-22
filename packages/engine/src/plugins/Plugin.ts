import { ParamWithInfo } from '@store/selectors/getParamWithInfo'

/**
 * Class type for a Plugin.
 */
export interface IPlugin {
  // new(engine: HedronEngine, useEngineStore: UseEngineStore): any;

  /**
   * The name of the plugin.
   */
  name: string

  /**
   * The description of the plugin.
   */
  description: string

  /**
   * Gets the selected parameter view.
   * @param param - The parameter with info.
   * @returns The JSX element or undefined if this plugin does not have a visual element.
   */
  getSelectedParamView?: (param: ParamWithInfo) => JSX.Element | undefined
}
