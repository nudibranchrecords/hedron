export interface ChildGroups {
  optionNodeIds: string[]
  inputNodeIds: string[]
}

/**
 * ChildGroupsLoose can be used with "as" when we want to allow for custom properties on ChildGroups,
 * without compromising type safety for the known properties.
 */
export interface ChildGroupsLoose extends ChildGroups {
  [key: string]: string[]
}

export interface NodeBase {
  id: string
  title: string
  parentIds: string[]
  childGroups: ChildGroups

  /** Allows plugins to attach custom arbitrary data to any node.
   * Best for special cases where params don't make sense (e.g. timeline keyframe data) */
  customData?: Record<string, unknown>
}

export interface ConfigNodeBase {
  key: string
  title?: string
  hidden?: boolean
}
