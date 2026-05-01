import { CustomNode } from './CustomNode'
import { Input } from './Input'
import { Param } from './Param'
import { Shot } from './Shot'

export type Node = Param | Shot | Input | CustomNode
export type Nodes = Partial<Record<string, Node>>
export type NodeType = Node['nodeType']
