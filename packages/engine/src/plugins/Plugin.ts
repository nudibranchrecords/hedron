import { NodeWithInfo } from '@store/types'

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
   * @node node - The parameter with info.
   * @returns The JSX element or undefined if this plugin does not have a visual element.
   */
  getSelectedNodeView?: (node: NodeWithInfo) => JSX.Element | undefined
}
