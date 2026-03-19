import { Nodes, Node } from '@store/types'

export const nodesAsArray = (nodes: Nodes) => Object.values(nodes) as Node[]
