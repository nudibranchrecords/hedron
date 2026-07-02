import { CustomNode } from './CustomNode'
import { Input } from './Input'
import { Param } from './Param'
import { Scene } from './Scene'
import { Sketch } from './Sketch'
import { Shot } from './Shot'

export type Node = Param | Shot | Input | CustomNode | Scene | Sketch
export type Nodes = Partial<Record<string, Node>>
export type NodeType = Node['nodeType']
