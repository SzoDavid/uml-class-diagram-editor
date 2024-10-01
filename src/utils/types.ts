import {ANode} from './nodes/ANode.ts';

export interface NodeData<T extends ANode> {
    type: 'class';
    instance: T;
}

export type DataContext<T extends ANode> = NodeData<T> | null;
export type ClickContext = 'prop' | 'operation' | 'param';