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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateInitialOptions: () => any
}
