export interface ChildGroups {
  [key: string]: string[] | undefined
  optionNodeIds: string[]
  inputNodeIds: string[]
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
