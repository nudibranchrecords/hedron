import { CustomNode } from './CustomNode'
import { InputNode } from './InputNode'
import { ParamNode } from './ParamNode'
import { SceneNode } from './SceneNode'
import { SketchNode } from './SketchNode'
import { ShotNode } from './ShotNode'

export type Node = ParamNode | ShotNode | InputNode | CustomNode | SceneNode | SketchNode
export type Nodes = Partial<Record<string, Node>>
export type NodeType = Node['nodeType']
